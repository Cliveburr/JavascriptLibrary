import * as webhost from 'webhost';

var server = new webhost.Server({
    rootApp: __dirname,
    wwwroot: __dirname
});

server.configureServices((services): void => {
});

server.configure((app) => {

    app.use(webhost.DefaultFiles);

    app.use(webhost.StaticFiles);

    app.useErrorNotFound();

});

server.listen(1338);