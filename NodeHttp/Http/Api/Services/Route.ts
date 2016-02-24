
module internal {


    export interface IRouteInfo {

        data: any;
        controllerName: string;
        pattern: string;
        defaults: any;
        name: string

        match(url: string): boolean;
    }

    export class RouteInfo implements IRouteInfo {


        constructor(name: string, pattern: string) {
            this.name = name;
            this.pattern = pattern;
        }

        public data: any;

        get controllerName() { return this.data["controllerName"]; };

        public pattern: string;
        public defaults: any;
        public name: string;


        private _varRegex: RegExp = /^\{(.*?)\}$/i;

        public match(url: string): boolean {
            this.data = {};
            var splitedUrl = url.split('/').removeAll('');
            var splitedPattern = this.pattern.split('/').removeAll('');
            if (splitedUrl.length > splitedPattern.length) {
                return false;
            } else {

                for (var i = 0; i < splitedPattern.length; i++) {
                    if (this._varRegex.test(splitedPattern[i])) {
                        this.data[this._varRegex.exec(splitedPattern[i])[1]] = splitedUrl[i];
                    }
                    else if (splitedUrl[i] !== splitedPattern[i]) {
                        return false
                    }
                }
                return true;
            }
            return false;
        }
    }

    export class RouteCollection {

        public routes: Array<RouteInfo>;

        constructor() {
            this.routes = [];
        }

        public addRoute(name: string, pattern: string) {
            this.routes.push(new RouteInfo(name, pattern));
        }


    }
}

export = internal;