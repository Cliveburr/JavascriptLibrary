import httpServer = require('../HttpServer');
import path = require('path');
import fs = require('fs');
import formatters = require('./Services/Formatter')
import routing = require('./Services/route')
import selector = require('./Services/ControllerSelector')
import controller = require('./ApiController')


module internal {

    export class ApiContext {
        public static instance: ApiContext = new ApiContext();

        public formatterService: formatters.RESTFormmaterService;
        public routes: routing.RouteCollection;
        public controllerSelector: selector.IControllerSelector;

        constructor() {
            this.formatterService = new formatters.RESTFormmaterService();
            this.routes = new routing.RouteCollection();
            this.controllerSelector = new selector.DefaultControllerSelector();
        }

    }

    export class Api implements httpServer.IPipeline {
        public process(pipeInfo: httpServer.IPipeInfo, next: () => void): void {

            var url = pipeInfo.request.url;

            var route = ApiContext.instance.routes.getRouteByUrl(url);

            if (route) {
                var controllerType = ApiContext.instance.controllerSelector.getType(pipeInfo, route);
                if (controllerType) {
                    var controller: controller.ApiController = new controllerType();
                    controller.init(pipeInfo, route);
                    var result = controller.execute();
                    result.execute(pipeInfo);
                    pipeInfo.alreadyProcess = true;
                }
            }

            next();
        }
    }  
}

export = internal;