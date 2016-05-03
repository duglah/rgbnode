import ioc from "./ioc";
import {ICommandCreator} from "./interfaces/ICommandCreator";
import {IColorConverter} from "./interfaces/IColorConverter";
import CommandCreator from "./CommandCreator";
import ColorConverter from "./ColorConverter";

ioc.registerSingleton<ICommandCreator>("ICommandCreator", () => new CommandCreator());
ioc.registerSingleton<IColorConverter>("IColorConverter", () => new ColorConverter());
