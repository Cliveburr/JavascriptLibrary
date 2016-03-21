/// <reference path="../../NodeHttp/Extenders.ts"/>
require('../../NodeHttp/Extenders');
import httpServer = require('../../NodeHttp/Http/HttpServer');
import files = require('../../NodeHttp/Http/Files');
import moc = require('./moc/MOC');

var server = new httpServer.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services) => {

    moc.addServices(services, {
        routes: [{name: 'default', pattern: 'moc/{controller}/{action?}'}]
    });

});

server.configure((app) => {

    app.use(moc.MOC);

    app.use(files.SpaFiles);

    app.use(files.StaticFiles);

    app.useErrorNotFound();

});

server.listen(1338);