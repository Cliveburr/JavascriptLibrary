import httpServer = require('../../HttpServer');


module internal {

    export interface IFormatter {


        mimeTypes: Array<string>;

        serialize(data: any): string;
        deserialize(data: string): any;

    }

    export abstract class BaseFormmater implements IFormatter {
        public mimeTypes: Array<string>;

        constructor() {
            this.mimeTypes = [];
        }

        abstract serialize(data: any): string;
        abstract deserialize(data: string): any;
    }

    export class JSONFormatter extends BaseFormmater {

        constructor() {
            super();
            this.mimeTypes.push("application/json");
        }

        mimeTypes: Array<string>;

        public serialize(data: any): string {
            return JSON.stringify(data);
        }

        public deserialize(data: string): any {
            return JSON.parse(data);
        }

    }

    export class RESTFormmaterService {


        public formatters: Array<IFormatter>;


        constructor() {
            this.formatters = [];
            this.formatters.push(new JSONFormatter());

        }

        public serialize(acceptHeaderValue: string, data: any) {
            var formatter = this.getFormatterByAcceptHeader(acceptHeaderValue);
            return formatter.serialize(data);
        }

        public deserialize(contentTypeValue: string, data: any) {
            var formatter = this.getFormatterByAcceptHeader(contentTypeValue);
            return formatter.deserialize(data);
        }

        private getFormatterByAcceptHeader(accept: string): IFormatter {
            //application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5

            if (accept) {

                var accepts = accept.split(',').remove("");

                for (var i = 0; i > accepts.length; i++) {
                    var ret = this.getFormatterByMimeType(accepts[i]);
                    if (ret)
                        return ret
                    else {
                        var acceptWitoutParams = accept.split(';').remove("");
                        var ret = this.getFormatterByMimeType(acceptWitoutParams[0]);
                        if (ret) return ret;
                    }
                }
            }
            return this.getFormatterByMimeType("application/json");
        }

        private getFormatterByContentTypeHeader(contentType: string): IFormatter {
            var ret = this.getFormatterByMimeType(contentType);
            if (ret) return ret;           
            return this.getFormatterByMimeType("application/json");
        }

        private getFormatterByMimeType(mimetype: string): IFormatter {
            return this.formatters.filterOne(f => f.mimeTypes.has(mimetype));
        }

    }


}

export = internal;