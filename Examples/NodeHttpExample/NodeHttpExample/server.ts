/// <reference path="../../../NodeHttp/Extenders.ts"/>
require('../../../NodeHttp/Extenders');
import httpServer = require('../../../NodeHttp/Http/HttpServer');
import files = require('../../../NodeHttp/Http/Files');
import mvc = require('../../../NodeHttp/Http/MVC');
import webSocket = require('../../../NodeHttp/Http/WebSocket');

var server = new httpServer.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services: httpServer.IConfigureServices): void => {

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
    
    app.use(files.DefaultFiles);

    app.use(files.StaticFiles);

    app.use(mvc.MVC);

    app.useErrorNotFound();

});

server.listen(1338);