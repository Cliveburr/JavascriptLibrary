import httpServer = require('../HttpServer');

import path = require('path');
import fs = require('fs');


module internal {

    export abstract class ApiController {

        public context:httpServer.IPipeInfo

        public init(context: httpServer.IPipeInfo): void {
            this.context = context;
        }

        public execute() {

            

        }


    }
}

export = internal;