/// <reference path="../../../NodeHttp/Extenders.ts"/>
require('../../../NodeHttp/Extenders');
import httpServer = require('../../../NodeHttp/Http/HttpServer');
import files = require('../../../NodeHttp/Http/Files');
import mvc = require('../../../NodeHttp/Http/MVC');
import webSocket = require('../../../NodeHttp/Http/WebSocket');
import api = require('../../../NodeHttp/Http/Api/Api');

var server = new httpServer.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

var __extends = function (d, b) {
    console.log('test');
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

server.configureServices((services: httpServer.IConfigureServices): void => {

    //var wss = new webSocket.Server(server);
    //wss.on('connection', function (ws) {
    //    var id = setInterval(function () {
    //        ws.send(JSON.stringify(process.memoryUsage()), function () { /* ignore errors */ });
    //    }, 100);
    //    console.log('started client interval');
    //    ws.on('close', function () {
    //        console.log('stopping client interval');
    //        clearInterval(id);
    //    });
    //});

});

server.configure((app) => {
    
  //  app.use(files.DefaultFiles);

   // app.use(files.StaticFiles);

    app.use(api.Api);
    api.ApiContext.instance.routes.addRoute("default", "api/{controller}/{action?}");

    app.useErrorNotFound();

    

});

server.listen(1338);