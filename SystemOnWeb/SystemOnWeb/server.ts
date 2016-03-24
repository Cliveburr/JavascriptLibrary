import httpServer = require('../../NodeHttp/Http/HttpServer');
import files = require('../../NodeHttp/Http/Files');

var server = new httpServer.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services) => {

});

server.configure((app) => {

    app.use(files.DefaultFiles);

    app.use(files.StaticFiles);

    app.useErrorNotFound();

});

server.listen(1338);