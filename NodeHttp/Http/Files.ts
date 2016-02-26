import httpServer = require('./HttpServer');
import path = require('path');
import fs = require('fs');

module internal {
    export interface IFileType {
        extension: string;
        contentType: string;
    }

    export class DefaultFiles implements httpServer.IPipeline {
        public static $inject = ['log'];

        public process(ctx: httpServer.IContext, next: () => void): void {
            if (ctx.request.url == '/') {
                ctx.request.url = '/index.html';
            }
            next();
        }
    }

    export class StaticFiles implements httpServer.IPipeline {
        public static $inject = ['log'];
        //public static $reusable = true;

        public static fileTypes: IFileType[] = [
            { extension: '.js', contentType: 'text/javascript' },
            { extension: '.js.map', contentType: 'application/json' },
            { extension: '.ts', contentType: 'text/x-typescript' },
            { extension: '.html', contentType: 'text/html' },
        ];

        //constructor() {
        //}

        public process(ctx: httpServer.IContext, next: () => void): void {
            var parts: string[] = ctx.request.url.split('/').removeAll('');
            parts.unshift(ctx.server.wwwroot);
            var file = path.resolve(parts.join('\\'));

            if (fs.existsSync(file)) {
                var extension = path.extname(file);
                var tp = StaticFiles.fileTypes.filterOne((t) => t.extension == extension);
                if (tp) {
                    ctx.response.writeHead(200, { "Content-Type": tp.contentType });
                    ctx.response.write(fs.readFileSync(file).toString());
                    ctx.alreadyProcess = true;
                }
            }

            next();
        }
    }
}

export = internal;