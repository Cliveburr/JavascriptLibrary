import httpServer = require('./HttpServer');
import path = require('path');
import fs = require('fs');

module internal {
    export interface IFileType {
        extension: string;
        contentType: string;
    }

    export class DefaultFiles implements httpServer.IPipeline {
        public process(pipeInfo: httpServer.IPipeInfo, next: () => void): void {
            if (pipeInfo.request.url == '/') {
                pipeInfo.request.url = '/index.html';
            }
            next();
        }
    }

    export class StaticFiles implements httpServer.IPipeline {
        public static $inject = ['log'];
        public static $pipeReusable = true;

        public static fileTypes: IFileType[] = [
            { extension: '.js', contentType: 'text/javascript' },
            { extension: '.js.map', contentType: 'application/json' },
            { extension: '.ts', contentType: 'text/x-typescript' },
            { extension: '.html', contentType: 'text/html' },
        ];

        constructor(
            private _log) {
        }

        public process(pipeInfo: httpServer.IPipeInfo, next: () => void): void {
            this._log.writeLine('StaticFiles: {0}'.format(pipeInfo.request.url));

            var parts: string[] = pipeInfo.request.url.split('/').removeAll('');
            parts.unshift(pipeInfo.server.wwwroot);
            var file = path.resolve(parts.join('\\'));

            if (fs.existsSync(file)) {
                var extension = path.extname(file);
                var tp = StaticFiles.fileTypes.filterOne((t) => t.extension == extension);
                if (tp) {
                    pipeInfo.response.writeHead(200, { "Content-Type": tp.contentType });
                    pipeInfo.response.write(fs.readFileSync(file).toString());
                    pipeInfo.alreadyProcess = true;
                }
            }

            next();
        }
    }
}

export = internal;