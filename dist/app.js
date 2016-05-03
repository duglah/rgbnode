"use strict";
var setup = require("./app.setup");
var request = require("request");
var ioc_1 = require("./ioc");
ioc_1.default.adapt(require("../node_modules/nodeclient").default);
var RGBNode = (function () {
    function RGBNode(client, colorConverter, commandCreator) {
        if (client === void 0) { client = ioc_1.default.resolve("INodeClient"); }
        if (colorConverter === void 0) { colorConverter = ioc_1.default.resolve("IColorConverter"); }
        if (commandCreator === void 0) { commandCreator = ioc_1.default.resolve("ICommandCreator"); }
        this.client = client;
        this.colorConverter = colorConverter;
        this.commandCreator = commandCreator;
        this.rgbPiServer = "http://127.0.0.1:4321";
        this.lastColorChange = Date.now();
        this.colorChangeMinWaitSec = 1000 * 1;
        this.client.command = "rgb";
        this.client.host = "127.0.0.1";
        this.client.port = "8089";
        this.init();
    }
    RGBNode.prototype.init = function () {
        var _this = this;
        this.client.onReceive(function (answer, param) {
            param = param.trim();
            console.log("Recieve: " + param);
            var fromNameToHex = _this.colorConverter.convertNameToColor(param);
            try {
                if (_this.colorConverter.isValidSixDigitHexcolor(param) || fromNameToHex) {
                    if (Date.now() >= _this.lastColorChange + _this.colorChangeMinWaitSec) {
                        console.log("Sending color: " + param);
                        _this.lastColorChange = Date.now();
                        _this.sendColorToServer(fromNameToHex ? fromNameToHex : param);
                        answer.send("Set :bulb: to " + (fromNameToHex ? fromNameToHex : param) + "!");
                        return;
                    }
                    answer.send();
                }
                else if (param && param.length > 0) {
                    if (param == "off") {
                        _this.sendColorToServer("#000000");
                        answer.send();
                    }
                    else {
                        var splitted = param.split(" ");
                        if (splitted && splitted.length == 2) {
                            var fromNameToHex_1 = _this.colorConverter.convertNameToColor(splitted[0]);
                            if ((fromNameToHex_1 || _this.colorConverter.isValidSixDigitHexcolor(splitted[0])) && _this.colorConverter.isValidNumber(splitted[1])) {
                                _this.sendFadeToServer(fromNameToHex_1 ? fromNameToHex_1 : splitted[0], splitted[1]);
                                answer.send("Fading :bulb: to " + splitted[0] + " in " + splitted[1] + " seconds!");
                            }
                            else {
                                _this.sendErrorBack(answer);
                            }
                        }
                        else {
                            _this.sendErrorBack(answer);
                        }
                    }
                }
                else {
                    console.log("send error back " + answer);
                    _this.sendErrorBack(answer);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    };
    RGBNode.prototype.start = function (cb) {
        this.client.start(cb);
    };
    RGBNode.prototype.sendColorToServer = function (hashTagColorHex) {
        console.log("sending color: " + hashTagColorHex);
        var req = this.commandCreator.createRequest([
            this.commandCreator.createColorChange(hashTagColorHex)
        ]);
        console.log("Calling: " + this.rgbPiServer + " with Command: " + JSON.stringify(request));
        this.sendRequest(req);
    };
    RGBNode.prototype.sendFadeToServer = function (color, time) {
        console.log("sending fade: color=" + color + "  time=" + time);
        var req = this.commandCreator.createRequest([
            this.commandCreator.createFade(color, time)
        ]);
        console.log("Calling: " + this.rgbPiServer + " with Command: " + JSON.stringify(req));
        this.sendRequest(req);
    };
    RGBNode.prototype.sendRequest = function (req) {
        var options = {
            uri: this.rgbPiServer,
            method: "POST",
            json: req,
            timeout: 5000
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Worked!");
                console.log(body);
            }
            else {
                console.error(error);
            }
        });
    };
    RGBNode.prototype.trimHashTag = function (hashtagColorHex) {
        if (hashtagColorHex.indexOf("#") == 0)
            return hashtagColorHex.substr(1, 6);
        else
            return hashtagColorHex;
    };
    RGBNode.prototype.sendErrorBack = function (answer) {
        answer.send("rgb Node Help:\n" +
            "Call your :robot_face: with 'rgb #SixDigitHexColor' to show a color.\n" +
            "Example: @yourBot rgb #123123");
    };
    return RGBNode;
}());
exports.RGBNode = RGBNode;
var rgbNode = new RGBNode();
rgbNode.start();

//# sourceMappingURL=app.js.map
