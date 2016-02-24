import httpServer = require('../../HttpServer');
import path = require('path');
import fs = require('fs');
import api = require('../Api');

module internal {


    export interface IHttpResult<T> {
        data: T;
        responseCode: number;
        execute(context: httpServer.IPipeInfo): void;
    }


    export abstract class HttpResultBase<T> implements IHttpResult<T> {

        public data: T;
        public responseCode: number;

        constructor(responseCode: number, data: T) {
            this.data = data;
            this.responseCode = responseCode;
        }

        public execute(context: httpServer.IPipeInfo): void {
            context.response.writeHead(this.responseCode);
            if (this.data) {
                var accept = context.request.headers["Accept"];
                var responseData = api.ApiContext.instance.formatterService.serialize(accept, this.data);
                context.response.write(JSON.stringify(this.data));
            }
        }

    }

    export class OkResult<T> extends HttpResultBase<T>  {
        constructor(data: T) {
            super(200, data);
        }
    }

    export class NoContent<T> extends HttpResultBase<T>  {

        constructor() {
            super(204, null);
        }
    }

    export class NotFoundResult<T> extends HttpResultBase<T>  {
        constructor(data: T) {
            super(404, data);
        }
    }

    export class InternalError<T> extends HttpResultBase<T>  {
        constructor(data: T) {
            super(500, data);
        }
    }

}


export = internal;