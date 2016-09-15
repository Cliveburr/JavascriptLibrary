import * as webhost from 'webhost';

var server = new webhost.Server({
    rootApp: __dirname,
    wwwroot: `${__dirname}\\src\\`
});

server.configureServices((services): void => {
});

export class SPA implements webhost.IPipeline {
     public process(ctx: webhost.IContext, next: () => void): void {
        let isAjax = ctx.request.headers['x-requested-with'] == 'XMLHttpRequest';
        if (!isAjax && ctx.request.url.indexOf('.') == -1) {
            ctx.request.url = '/index.html';
        } 
        next();
    }
}

server.configure((app) => {

    app.use(SPA);

    app.use(webhost.StaticFiles);

    app.useErrorNotFound();

});

server.listen(1337);