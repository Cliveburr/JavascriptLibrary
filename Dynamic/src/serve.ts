import { Server, DefaultFiles, StaticFiles } from 'webhost';
import { Es6Adapter } from './es6-adapter';

var server = new Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/../wwwroot'
});

server.configureServices((services): void => {
});

server.configure((app) => {

    app.use(Es6Adapter);

    app.use(StaticFiles);

    app.useErrorNotFound();

});

server.listen(1338);