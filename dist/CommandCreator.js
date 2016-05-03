"use strict";
var ioc = require("./ioc");
var ICommandCreator_1 = require("./interfaces/ICommandCreator");
var CommandCreator = (function () {
    function CommandCreator(colorConverter) {
        if (colorConverter === void 0) { colorConverter = ioc.default.resolve("IColorConverter"); }
        this.colorConverter = colorConverter;
    }
    CommandCreator.prototype.createColorChange = function (colorHex, operator) {
        var cc = new ICommandCreator_1.ColorChangeCommand();
        cc.color = this.toColorObjectString(colorHex);
        if (operator) {
            cc.operator = operator == ICommandCreator_1.ColorChangeOperator.Add ? "+"
                : operator == ICommandCreator_1.ColorChangeOperator.Subtract ? "-"
                    : operator == ICommandCreator_1.ColorChangeOperator.Multiply ? "*"
                        : operator == ICommandCreator_1.ColorChangeOperator.Devide ? "/"
                            : null;
        }
        return cc;
    };
    CommandCreator.prototype.createFade = function (toHex, time, fromHex) {
        var fade = new ICommandCreator_1.FadeCommand();
        fade.end = this.toColorObjectString(toHex);
        fade.time = time.toString();
        if (fromHex) {
            fade.start = this.toColorObjectString(fromHex);
        }
        return fade;
    };
    CommandCreator.prototype.createLoop = function (condition, commands) {
        var loop = new ICommandCreator_1.LoopCommand();
        loop.condition = condition;
        loop.commands = commands;
        return loop;
    };
    CommandCreator.prototype.createWait = function (time) {
        var wait = new ICommandCreator_1.WaitCommand();
        wait.time = time.toString();
        return wait;
    };
    CommandCreator.prototype.createRequest = function (commands) {
        var request = new ICommandCreator_1.Request();
        request.commands = commands;
        return request;
    };
    CommandCreator.prototype.toColorObjectString = function (colorHex) {
        var trimmed = this.colorConverter.trimHashTag(colorHex);
        if (this.colorConverter.isValidSixDigitHexcolor(trimmed))
            return "{x:" + trimmed + "}";
        else
            throw new Error(colorHex + " is not a valid color. try something like #00ff00  or AFFFFE");
    };
    return CommandCreator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommandCreator;

//# sourceMappingURL=CommandCreator.js.map
