/// <reference path="../../../NodeHttp/Extenders.ts"/>
require('../../../NodeHttp/Extenders');
import httpServer = require('../../../NodeHttp/Http/HttpServer');
import files = require('../../../NodeHttp/Http/Files');
import mvc = require('../../../NodeHttp/Http/MVC');
import webSocket = require('../../../NodeHttp/Http/WebSocket');
import api = require('../../../NodeHttp/Http/Api/Api');
import identity = require('../../../NodeHttp/Services/Identity');
import log = require('../../../NodeHttp/Services/Log');

var server = new httpServer.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services: httpServer.IConfigureServices): void => {

    services.addSingleton<log.LogServices>('log', log.LogServices, (log) => {
        log.output = 'D:\\testlog.txt';
    });

    services.add(identity.identityServices, (identity) => void {
    });

    var wss = new webSocket.Server(server);
    wss.on('connection', function (ws) {
        var id = setInterval(function () {
            ws.send(JSON.stringify(process.memoryUsage()), function () { /* ignore errors */ });
        }, 100);
        console.log('started client interval');
        ws.on('close', function () {
            console.log('stopping client interval');
            clearInterval(id);
        });
    });

});

server.configure((app) => {
    
    var log = app.useService<log.LogServices>('log');
    log.writeLine('App initialized...');

    app.use(files.DefaultFiles);

    app.use(files.StaticFiles);

    app.use(api.Api);
    api.ApiContext.instance.routes.addRoute("default", "api/{controller}/{action?}");

    app.useErrorNotFound();

});

server.listen(1338);