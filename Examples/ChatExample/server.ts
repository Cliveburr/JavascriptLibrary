/// <reference path="typings/index.d.ts"/>
/// <reference path="../../NodeHttp/Extenders.ts"/>
require('../../NodeHttp/Extenders');
import httpServer = require('../../NodeHttp/Http/HttpServer');
import files = require('../../NodeHttp/Http/Files');
import webSocket = require('../../NodeHttp/Services/WebSocket');
import hub = require('./hub');

var server = new httpServer.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services: httpServer.IConfigureServices): void => {

    webSocket.addServices(services, [
        { path: 'Chat', item: hub.ChatHub }
    ]);

});

server.configure((app) => {
    
    app.use(files.DefaultFiles);

    app.use(files.StaticFiles);

    app.use(webSocket.ClientFile);

    app.useErrorNotFound();

});

server.listen(1338);