"use strict";
var Request = (function () {
    function Request() {
    }
    return Request;
}());
exports.Request = Request;
var ColorChangeCommand = (function () {
    function ColorChangeCommand() {
        this.type = "cc";
        this.color = "{x:000000}";
        this.operator = null;
    }
    return ColorChangeCommand;
}());
exports.ColorChangeCommand = ColorChangeCommand;
var FadeCommand = (function () {
    function FadeCommand() {
        this.type = "cc";
        this.start = null;
        this.end = "{x:000000}";
    }
    return FadeCommand;
}());
exports.FadeCommand = FadeCommand;
var LoopCommand = (function () {
    function LoopCommand() {
        this.type = "loop";
        this.condition = "{b:1}";
        this.commands = [];
    }
    return LoopCommand;
}());
exports.LoopCommand = LoopCommand;
var WaitCommand = (function () {
    function WaitCommand() {
        this.type = "wait";
    }
    return WaitCommand;
}());
exports.WaitCommand = WaitCommand;
(function (ColorChangeOperator) {
    ColorChangeOperator[ColorChangeOperator["None"] = 0] = "None";
    ColorChangeOperator[ColorChangeOperator["Add"] = 1] = "Add";
    ColorChangeOperator[ColorChangeOperator["Subtract"] = 2] = "Subtract";
    ColorChangeOperator[ColorChangeOperator["Multiply"] = 3] = "Multiply";
    ColorChangeOperator[ColorChangeOperator["Devide"] = 4] = "Devide";
})(exports.ColorChangeOperator || (exports.ColorChangeOperator = {}));
var ColorChangeOperator = exports.ColorChangeOperator;

//# sourceMappingURL=ICommandCreator.js.map
