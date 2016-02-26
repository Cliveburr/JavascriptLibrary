import httpServer = require('./HttpServer');
import http = require('http');
import path = require('path');
import fs = require('fs');

module internal {

    export interface IMVCMethodParams {
        request: http.IncomingMessage;
        response: http.ServerResponse;
        isProcessed: boolean;
        postContent: string;
    }

    export interface IMVCRequest {
        (): http.IncomingMessage;
    }

    export class MVC implements httpServer.IPipeline {
        public static controllersFolder = 'Controllers';

        public process(ctx: httpServer.IContext, next: () => void): void {
            var parts: string[] = ctx.request.url.split('/').removeAll('');

            if (parts.length == 0)
                return;

            var ctrPath = ctx.server.rootApp + '\\' + MVC.controllersFolder + '\\' + parts[0] + '.js';
            var ctrFile = path.resolve(ctrPath);

            if (!fs.existsSync(ctrFile)) {
                next();
                return;
            }

            var ctrModule = require(ctrFile);
            var ctr = ctx.inject(ctrModule);

            var method = parts[1];

            if (!ctr[method]) {
                next();
                return;
            }

            var methodParams: IMVCMethodParams = {
                request: ctx.request,
                response: ctx.response,
                isProcessed: true,
                postContent: ''
            }

            var processMethod = () => {
                ctr[method](methodParams);
                ctx.alreadyProcess = methodParams.isProcessed;
                next();
            };

            if (ctx.request.method == 'POST') {
                var contentData = '';

                ctx.request.on('data', function (data) {
                    contentData += data;
                });

                ctx.request.on('end', function () {
                    methodParams.postContent = contentData;
                    processMethod();
                });
            }
            else {
                processMethod();
            }
        }
    }

}

export = internal;