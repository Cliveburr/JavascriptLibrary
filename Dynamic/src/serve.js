"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webhost_1 = require("webhost");
const es6_adapter_1 = require("./es6-adapter");
var server = new webhost_1.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/../wwwroot'
});
server.configureServices((services) => {
});
server.configure((app) => {
    app.use(es6_adapter_1.Es6Adapter);
    app.use(webhost_1.StaticFiles);
    app.useErrorNotFound();
});
server.listen(1338);
//# sourceMappingURL=serve.js.map