export interface ICommandCreator {
    createColorChange(colorHex: string, operator?: ColorChangeOperator): Command;
    createFade(toHex: string, time: string|number, fromHex?: string): Command;
    createLoop(condition: string, commands: Array<Command>): Command;
    createWait(time:string|number):Command;
    createRequest(commands?:Array<Command>):Request;
}

export class Request {
    commands: Array<Command>
}

export interface Command {
    type: string;
}

export class ColorChangeCommand implements Command {
    type: string = "cc";
    color: string = "{x:000000}";
    operator: string = null;
}

export class FadeCommand implements Command {
    type: string = "cc";
    start: string = null;
    end: string = "{x:000000}";
    time: string; //e.g.: 5.1 or {c:10.5} or {r:0.1-10}
}

export class LoopCommand implements Command {
    type: string = "loop";
    condition: string = "{b:1}"; // or {t:time} or {i:iterations} or {c:{x:000000}}
    commands: Array<Command> = []
}

export class WaitCommand implements Command {
    type: string = "wait";
    time: string; //e.g.: 5.1 or {c:10.5} or {r:0.1-10}
}

export enum ColorChangeOperator {
    None,
    Add,
    Subtract,
    Multiply,
    Devide
}

export default ICommandCreator;