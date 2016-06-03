import httpServer = require('./HttpServer');
import path = require('path');
import fs = require('fs');
import url = require('url');

module internal {
    export interface IFileType {
        extension: string;
        contentType: string;
    }

    export class DefaultFiles implements httpServer.IPipeline {
        //public static $inject = ['log'];

        public process(ctx: httpServer.IContext, next: () => void): void {
            if (ctx.request.url == '/') {
                ctx.request.url = '/index.html';
            }
            next();
        }
    }

    export class StaticFiles implements httpServer.IPipeline {
        //public static $inject = ['log'];
        //public static $reusable = true;

        public static fileTypes: IFileType[] = [
            { extension: '.js', contentType: 'text/javascript' },
            { extension: '.map', contentType: 'application/json' },
            { extension: '.ts', contentType: 'text/x-typescript' },
            { extension: '.html', contentType: 'text/html' },
            { extension: '.css', contentType: 'text/css' }
        ];

        //constructor() {
        //}

        public process(ctx: httpServer.IContext, next: () => void): void {
            let pu = url.parse(ctx.request.url);

            //var parts: string[] = ctx.request.url.split('/').removeAll('');
            //parts.unshift(ctx.server.wwwroot);
            //var file = path.resolve(parts.join('\\'));
            let file = path.resolve(ctx.server.wwwroot + pu.pathname);

            if (fs.existsSync(file)) {
                var extension = path.extname(file);
                var tp = StaticFiles.fileTypes.filterOne((t) => t.extension == extension);
                if (tp) {
                    ctx.response.setHeader('etag', '1234');
                    ctx.response.writeHead(200, { "Content-Type": tp.contentType });
                    ctx.response.write(fs.readFileSync(file).toString());
                    ctx.alreadyProcess = true;
                }
            }

            next();
        }
    }

    export class SpaFiles implements httpServer.IPipeline {
        public static fileTypes: string[] = [
            '.js', '.map', '.ts', 'css', '.html'
        ];

        public process(ctx: httpServer.IContext, next: () => void): void {
            if (ctx.request.url == '/') {
                ctx.request.url = '/index.html';
            }
            else {
                var valid = false;
                for (var i = 0, t: string; t = SpaFiles.fileTypes[i]; i++) {
                    if (ctx.request.url.endsWith(t)) {
                        valid = true;
                        break;
                    }
                }
                if (!valid)
                    ctx.request.url = '/index.html';
            }
            next();
        }
    }
}

export = internal;