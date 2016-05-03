import ioc = require("./ioc");

import {IColorConverter} from "./interfaces/IColorConverter";
import {
    ICommandCreator,
    ColorChangeCommand,
    ColorChangeOperator,
    FadeCommand,
    LoopCommand,
    WaitCommand,
    Command,
    Request
} from "./interfaces/ICommandCreator";

export default class CommandCreator implements ICommandCreator {
    constructor(
        private colorConverter: IColorConverter = ioc.default.resolve<IColorConverter>("IColorConverter")
    ) { }

    createColorChange(colorHex: string, operator?: ColorChangeOperator): Command {
        let cc = new ColorChangeCommand();
        cc.color = this.toColorObjectString(colorHex);
        if (operator) {
            cc.operator = operator == ColorChangeOperator.Add ? "+"
                : operator == ColorChangeOperator.Subtract ? "-"
                    : operator == ColorChangeOperator.Multiply ? "*"
                        : operator == ColorChangeOperator.Devide ? "/"
                            : null
        }

        return cc;
    }

    createFade(toHex: string, time: string | number, fromHex?: string): Command {
        let fade = new FadeCommand();
        fade.end = this.toColorObjectString(toHex);
        fade.time = time.toString();
        if (fromHex) {
            fade.start = this.toColorObjectString(fromHex);
        }
        return fade;
    }

    createLoop(condition: string, commands: Array<Command>): Command {
        let loop = new LoopCommand();
        loop.condition = condition;
        loop.commands = commands;
        return loop;
    }

    createWait(time: string | number): Command {
        let wait = new WaitCommand();
        wait.time = time.toString();
        return wait;
    }

    createRequest(commands?: Array<Command>): Request {
        let request = new Request();
        request.commands = commands;
        return request;
    }

    private toColorObjectString(colorHex: string): string {
        let trimmed = this.colorConverter.trimHashTag(colorHex);
        if(this.colorConverter.isValidSixDigitHexcolor(trimmed))
            return "{x:" + trimmed + "}";
        else throw new Error(colorHex+" is not a valid color. try something like #00ff00  or AFFFFE");
    }
}