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

        public process(pipeInfo: httpServer.IPipeInfo, next: () => void): void {
            var parts: string[] = pipeInfo.request.url.split('/').removeAll('');

            if (parts.length == 0)
                return;

            debugger;
            var ctrPath = pipeInfo.server.rootApp + '\\' + MVC.controllersFolder + '\\' + parts[0] + '.js';
            var ctrFile = path.resolve(ctrPath);

            if (!fs.existsSync(ctrFile)) {
                next();
                return;
            }

            var ctrModule = require(ctrFile);
            var ctr = new ctrModule();

            var method = parts[1];

            if (!ctr[method]) {
                next();
                return;
            }

            var methodParams: IMVCMethodParams = {
                request: pipeInfo.request,
                response: pipeInfo.response,
                isProcessed: true,
                postContent: ''
            }

            var processMethod = () => {
                ctr[method](methodParams);
                pipeInfo.alreadyProcess = methodParams.isProcessed;
                next();
            };

            if (pipeInfo.request.method == 'POST') {
                var contentData = '';

                pipeInfo.request.on('data', function (data) {
                    contentData += data;
                });

                pipeInfo.request.on('end', function () {
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