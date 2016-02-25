import httpServer = require('../HttpServer');

import path = require('path');
import fs = require('fs');
import routing = require('./Services/route')
import results = require('./Results/HttpResult')




module internal {

    export abstract class ApiController {

        public context: httpServer.IPipeInfo
        public route: routing.RouteInfo;

        public init(context: httpServer.IPipeInfo, route: routing.RouteInfo): void {
            this.context = context;
            this.route = route.data;
        }

        public execute(): results.IHttpResult {

            try {
                var method;
                if (this.route.actionName) {
                    var action = this.route.actionName.toLowerCase();

                    for (var key in this) {
                        if (key.toLowerCase() === action) {
                            method = this[action];
                            if (typeof method !== "function") {
                                method = null;
                            }
                        }
                    }

                }
                if (!method) {
                    var action = this.context.request.method.toLowerCase();
                    var method = this[action];
                    if (typeof method !== "function") {
                        method = null;
                    }
                }

                if (!method) {
                    return this.notAllowed("method not allowed");
                }

                var ret = method.apply(this);

                if (ret instanceof results.HttpResultBase) {
                    return ret;
                } else {
                    return this.ok(ret);
                }
            } catch (e) {
                this.internalError(e);
            }
        }



        public notAllowed<T>(data?: T): results.HttpResultBase<T> {
            return new results.NotAllowedResult(data);
        }

        public ok<T>(data: T): results.HttpResultBase<T> {
            return new results.OkResult(data);
        }

        public okNoContent(): results.IHttpResult {
            return new results.NoContentResult();
        }

        public notFound<T>(data?: T): results.HttpResultBase<T> {
            return new results.NotFoundResult(data);
        }

        public internalError<T>(data?: T): results.HttpResultBase<T> {
            return new results.InternalErrorResult(data);
        }
    }
}

export = internal;