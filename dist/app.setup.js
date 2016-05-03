"use strict";
var ioc_1 = require("./ioc");
var CommandCreator_1 = require("./CommandCreator");
var ColorConverter_1 = require("./ColorConverter");
ioc_1.default.registerSingleton("ICommandCreator", function () { return new CommandCreator_1.default(); });
ioc_1.default.registerSingleton("IColorConverter", function () { return new ColorConverter_1.default(); });

//# sourceMappingURL=app.setup.js.map
