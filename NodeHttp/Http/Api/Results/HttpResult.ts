import httpServer = require('../../HttpServer');
import path = require('path');
import fs = require('fs');

module internal {

    export interface IHttpResult {
        data: any;
        responseCode: number;
        execute(context: httpServer.IContext): void;
    }

    export abstract class HttpResultBase<T> implements IHttpResult {

        public data: T;
        public responseCode: number;

        constructor(responseCode: number, data: T) {
            this.data = data;
            this.responseCode = responseCode;
        }

        public execute(context: httpServer.IContext): void {
            context.response.writeHead(this.responseCode);
            if (this.data) {
                var accept = context.request.headers["Accept"];
                var api = require('../Api');
                var responseData = api.ApiContext.instance.formatterService.serialize(accept, this.data);
                context.response.write(responseData);
            }
        }

    }

    export class OkResult<T> extends HttpResultBase<T>  {
        constructor(data: T) {
            super(200, data);
        }
    }

    export class NoContentResult<T> extends HttpResultBase<T>  {

        constructor() {
            super(204, null);
        }
    }

    export class NotFoundResult<T> extends HttpResultBase<T>  {
        constructor(data: T) {
            super(404, data);
        }
    }

    export class NotAllowedResult<T> extends HttpResultBase<T>  {
        constructor(data: T) {
            super(405, data);
        }
    }

    export class InternalErrorResult<T> extends HttpResultBase<T>  {
        constructor(data: T) {
            super(500, data);
        }
    }



}


export = internal;