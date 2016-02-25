import httpServer = require('../../HttpServer');
import routeI = require('../Services/Route');
import api = require('../ApiController')
import path = require('path');
import fs = require('fs');



module internal {

    export interface IControllerSelector{

        getType(context: httpServer.IPipeInfo, route: routeI.IRouteInfo): any; 

    }

    export class DefaultControllerSelector implements IControllerSelector {
        public getType(context: httpServer.IPipeInfo, route: routeI.IRouteInfo): any {

            var ctrPath = context.server.rootApp + '\\Controllers\\' + route.controllerName + '.js';
            var ctrFile = path.resolve(ctrPath);

            if (!fs.existsSync(ctrFile)) {
                return;
            }
            var ctrModule: FunctionConstructor = require(ctrFile);

            if (ctrModule.prototype instanceof api.ApiController) {
                return ctrModule;
            }

            return null;
        }
    }

}


export = internal;