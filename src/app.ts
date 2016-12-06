/// <reference path="../typings/request/request.d.ts" />

var setup = require("./app.setup");
import request = require("request");
import {IColorConverter} from "./interfaces/IColorConverter";
import {ICommandCreator, Request} from "./interfaces/ICommandCreator";
import {INodeClient, Answer} from  "../node_modules/nodeclient/src/interfaces/INodeClient";
import ioc from "./ioc";
ioc.adapt(require("../node_modules/nodeclient").default);


export class RGBNode {
    rgbPiServer:string = "http://127.0.0.1:4321";
    lastColorChange:number = Date.now();
    colorChangeMinWaitSec:number = 1000 * 1;
    
    constructor(
        private client: INodeClient = ioc.resolve<INodeClient>("INodeClient"),
        private colorConverter: IColorConverter = ioc.resolve<IColorConverter>("IColorConverter"),
        private commandCreator: ICommandCreator = ioc.resolve<ICommandCreator>("ICommandCreator")
    ) {
        this.client.command = "rgb";
        this.client.host = "127.0.0.1";
        this.client.port = "8089";
        
        this.init();
    }

    private init(): void {
        this.client.onReceive((answer: Answer, param: string) => {
            param = param.trim();
            console.log("Recieve: " + param);
            let fromNameToHex = this.colorConverter.convertNameToColor(param);
            try {
                if (this.colorConverter.isValidSixDigitHexcolor(param) || fromNameToHex) {
                    if (Date.now() >= this.lastColorChange + this.colorChangeMinWaitSec) {
                        console.log("Sending color: " + param);

                        this.lastColorChange = Date.now();
                        this.sendColorToServer(fromNameToHex ? fromNameToHex : param);
                        answer.send("Set :bulb: to " + (fromNameToHex ? fromNameToHex : param) + "!");
                        return;
                    }

                    answer.send();
                }
                else if (param && param.length > 0) {
                    if (param == "off") {

                        this.sendColorToServer("#000000");
                        answer.send();
                    }
                    else {
                        let splitted = param.split(" ");
                        if (splitted && splitted.length == 2) {
                            let fromNameToHex = this.colorConverter.convertNameToColor(splitted[0]);
                            if ((fromNameToHex || this.colorConverter.isValidSixDigitHexcolor(splitted[0])) && this.colorConverter.isValidNumber(splitted[1])) {
                                this.sendFadeToServer(fromNameToHex ? fromNameToHex : splitted[0], splitted[1]);
                                answer.send("Fading :bulb: to " + splitted[0] + " in " + splitted[1] + " seconds!");
                            }
                            else {
                                this.sendErrorBack(answer);
                            }
                        }
                        else {
                            this.sendErrorBack(answer);
                        }
                    }
                }
                else {
                    console.log("send error back " + answer);
                    this.sendErrorBack(answer);
                }
            } catch (err) {
                console.log(err)
            }
        });
    }

    public start(cb?: (error: any) => void): void {
        this.client.start(cb);
        this.client.register((error, success) => {
            if(success){
                console.log("successfull registered to slackbotnode");
            }else{
                console.error("ERROR: "+error);
            }
        })
    }

    private sendColorToServer(hashTagColorHex: string): void {
        console.log("sending color: " + hashTagColorHex);
        let req = this.commandCreator.createRequest(
            [
                this.commandCreator.createColorChange(hashTagColorHex)
            ]
        );

        console.log("Calling: " + this.rgbPiServer + " with Command: " + JSON.stringify(request));
        this.sendRequest(req);
    }

    sendFadeToServer(color: string, time: string | number): void {
        console.log("sending fade: color=" + color + "  time=" + time);
        let req = this.commandCreator.createRequest(
            [
                this.commandCreator.createFade(color, time)
            ]
        );
        
        console.log("Calling: " + this.rgbPiServer + " with Command: " + JSON.stringify(req));
        this.sendRequest(req);
    }

    private sendRequest(req: Request): void {
        let options = {
            uri: this.rgbPiServer,
            method: "POST",
            json: req,
            timeout: 5000
        };
        
        request(options, (error, response, body)=> {
            if (!error && response.statusCode == 200) {
                console.log("Worked!");
                console.log(body);
            }
            else {
                console.error(error);
            }
        });
    }

    private trimHashTag(hashtagColorHex: string) {
        if (hashtagColorHex.indexOf("#") == 0) return hashtagColorHex.substr(1, 6);
        else return hashtagColorHex;
    }

    sendErrorBack(answer: Answer) {
        answer.send("rgb Node Help:\n" +
            "Call your :robot_face: with 'rgb #SixDigitHexColor' to show a color.\n" +
            "Example: @yourBot rgb #123123");
    }
}

let rgbNode = new RGBNode();
rgbNode.start(error => {
    if(error){
        console.log("ERROR: "+error);
    }else{
        console.log("start successfull");
    }
});