import httpServer = require('./HttpServer');
import path = require('path');
import fs = require('fs');

module internal {
    export interface IFileType {
        extension: string;
        contentType: string;
    }

    export class DefaultFiles implements httpServer.IPipeline {
        public process(pipeInfo: httpServer.IPipeInfo): void {
            if (pipeInfo.request.url == '/') {
                pipeInfo.request.url = '/index.html';
            }
        }
    }

    export class StaticFiles implements httpServer.IPipeline {
        public static fileTypes: IFileType[] = [
            { extension: '.js', contentType: 'text/javascript' },
            { extension: '.js.map', contentType: 'application/json' },
            { extension: '.ts', contentType: 'text/x-typescript' },
            { extension: '.html', contentType: 'text/html' },
        ];

        public process(pipeInfo: httpServer.IPipeInfo): void {
            var parts: string[] = pipeInfo.request.url.split('/').removeAll('');
            parts.unshift(pipeInfo.server.rootApp);
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
        }
    }
}

export = internal;