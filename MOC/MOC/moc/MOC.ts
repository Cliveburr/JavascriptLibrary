import httpServer = require('../../../NodeHttp/Http/HttpServer');
import route = require('../../../NodeHttp/Services/Route');
import path = require('path');
import fs = require('fs');

module internal {
    export interface IMOCConfiguration {
        routes?: route.IRoute[];
    }

    export interface IObject {
        _n?: string;
        _d?: string[];
        _v?: any;
        _c?: IObject[];
    }

    export interface IObjectDef {
        getObject(): IObject;
    }

    export function addServices(services: httpServer.IConfigureServices, config: IMOCConfiguration): void {
        services.addSingleton<route.IRouteService>('mocRoute', route.RouteService)
            .on(tRoute => {
                if (config.routes) {
                    for (var i = 0, r: route.IRoute; r = config.routes[i]; i++) {
                        tRoute.addRoute(r.name, r.pattern, r.defaults);
                    }
                }
            });
    }

    export class MOC implements httpServer.IPipeline {
        public static $inject = ['mocRoute'];

        constructor(
            private _route: route.IRouteService) {
        }

        public process(ctx: httpServer.IContext, next: () => void): void {
            var route = this._route.getRouteByUrl(ctx.request.url);

            if (!route) {
                next();
                return;
            }

            var ctrPath = ctx.server.rootApp + '\\Controllers\\' + route.controller + '.js';
            var ctrFile = path.resolve(ctrPath);

            if (!fs.existsSync(ctrFile)) {
                next();
                return;
            }

            var ctrModule: FunctionConstructor = require(ctrFile);
            var ctr: ControllerBase = ctx.inject<ControllerBase>(ctrModule);

            var action = route.action ? route.action : 'Index';

            if (!ctr[action]) {
                next();
                return;
            }

            ctr.context = ctx;

            var postData = '';

            var processMethod = () => {
                this.processMethod(ctr, action, postData);
                ctx.alreadyProcess = true;
                next();
            };

            if (ctx.request.method == 'POST') {
                ctx.request.on('data', (data) => {
                    postData += data;
                });
                ctx.request.on('end', () => {
                    processMethod();
                });
            }
            else {
                processMethod();
            }
        }

        private processMethod(ctr: ControllerBase, action: string, postData: string): void {
            var postObj = postData ? JSON.parse(postData): null;
            var params = [];

            if (postData) {
                for (var p in postObj) {
                    params.push(postObj[p]);
                }
            }

            ctr[action].apply(ctr, params);
        }
    }

    export class ControllerBase {
        public context: httpServer.IContext;

        public postObject(obj: IObjectDef): void {
            this.context.response.writeHead(200, { "Content-Type": "application/json" });
            var tr = obj.getObject();
            this.context.response.write(JSON.stringify(tr));
        }
    }
}

export = internal;