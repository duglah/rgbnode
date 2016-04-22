var request = require('request');
var client = require('../nodeclient')();

var colorChangeMinWaitSec = 1000 * 1;

var rgbPiServer = "http://127.0.0.1:4321";

var lastColorChange = Date.now();

client.command = "rgb";
client.host = "127.0.0.1";
client.port = "8089";

client.onRecieve(function(answer, param) {
    
    console.log("Recieve: "+param);
    
    if (isValidSixDigitHexcolor(param)) {
        if (Date.now() >= lastColorChange + colorChangeMinWaitSec) {
            console.log("Sending color: "+param);
            
            lastColorChange = Date.now();
            sendColorToServer(param);
            answer.send("Set :bulb: to " + param + "!");
            return;
        }

        answer.send();
    }
    else if(param && param.length > 0){
        if(param == "off"){
            
            sendColorToServer("#000000");
            answer.send();
        }
        else{
            var splitted = param.split(" ");
            if(splitted && splitted.length == 2){
                if(isValidSixDigitHexcolor(splitted[0]) && isValidNumber(splitted[1])){
                    sendFadeToServer(splitted[0], splitted[1]);
                    answer.send("Fading :bulb: to " + splitted[0] + " in "+splitted[1]+" seconds!");
                }
                else{
                    sendErrorBack(answer);
                }
            }
            else{
                sendErrorBack(answer);
            }
        }
    }
    else
        sendErrorBack(answer);
});

client.ready(function() {
    client.register(function(error, success) {
        if (error != null)
            console.error(error);
        else
            console.log("Registered!");
    });
});

client.start();

function isValidSixDigitHexcolor(color) {
    return /^#[0-9A-F]{6}$/i.test(color);
}

function isValidNumber(number){
    return /^[\d.]+(?:e-?\d+)?$/.test(number);
}

function sendErrorBack(answer) {
    answer.send("rgb Node Help:\n"+
    "Call your :robot_face: with 'rgb #SixDigitHexColor' to show a color.\n"+
    "Example: @yourBot rgb #123123");
}

function sendColorToServer(color) {  
    var commandObject = {
        commands : [
            {
                type: "cc",
                color: "{x:"+color.substr(1,6)+"}"
            }
        ]
    }

    var options = {
        uri: rgbPiServer,
        method: "POST",
        json: commandObject,
        timeout: 5000
    };

    console.log("Calling: "+rgbPiServer+" with Command: "+JSON.stringify(commandObject));

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200){
            console.log("Worked!");
            console.log(body);
        }
        else {
            console.error(error);
        }
    });
}

function sendFadeToServer(color, time) {  
    var commandObject = {
        commands : [
            {
                type: "fade",
                time: time,
                end: "{x:"+color.substr(1,6)+"}"
            }
        ]
    }

    var options = {
        uri: rgbPiServer,
        method: "POST",
        json: commandObject,
        timeout: 5000
    };

    console.log("Calling: "+rgbPiServer+" with Command: "+JSON.stringify(commandObject));

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200){
            console.log("Worked!");
            console.log(body);
        }
        else {
            console.error(error);
        }
    });
}