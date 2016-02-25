import httpServer = require('../HttpServer');
import path = require('path');
import fs = require('fs');
import formatters = require('./Services/Formatter')

module internal {
    
    export class Api implements httpServer.IPipeline {
        public process(pipeInfo: httpServer.IPipeInfo, next: () => void): void {
            if (pipeInfo.request.url == '/') {
                pipeInfo.request.url = '/index.html';
            }
            next();
        }
    }

    export class ApiContext {

        public static instance: ApiContext = new ApiContext();

        public formatterService: formatters.RESTFormmaterService;

        constructor() {
            this.formatterService = new formatters.RESTFormmaterService();
        }

    }
}

export = internal;