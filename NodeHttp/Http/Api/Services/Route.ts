
module internal {


    export interface IRoute {
        pattern: string;
        defaults: any;
        name: string
        match(url: string): boolean;
        getData(): IRouteInfo;
    }

    export interface IRouteInfo {
        data: any;
        controllerName: string;
        actionName: string;
    }

    export class RouteInfo implements IRouteInfo {

        constructor() {
            this.data = {};
        }

        public data: any;
        get controllerName(): string { return this.data["controller"]; };
        get actionName(): string { return this.data["action"]; };
    }

    export class Route implements IRoute {


        constructor(name: string, pattern: string, defaults?: any) {
            this.name = name;
            this.pattern = pattern;
            this.defaults = defaults;
        }

        private _data: IRouteInfo;

      
        public pattern: string;
        public defaults: any;
        public name: string;


        private _varRegex: RegExp = /^\{(.*?)\}$/i;

        public match(url: string): boolean {
            this._data = new RouteInfo;
            var splitedUrl = url.split('/').removeAll('');
            var splitedPattern = this.pattern.split('/').removeAll('');
            if (splitedUrl.length > splitedPattern.length) {
                return false;
            } else {

                for (var i = 0; i < splitedPattern.length; i++) {
                    if (this._varRegex.test(splitedPattern[i])) {
                        var urlVarName = this._varRegex.exec(splitedPattern[i])[1];
                        if (!splitedUrl[i]) {

                            if (this.defaults && urlVarName in this.defaults) {
                                this._data.data[urlVarName] = this.defaults[urlVarName];
                            } else if (urlVarName.indexOf('?') === urlVarName.length-1) {
                                
                            } else {
                                return false;
                            }

                        } else {
                            this._data.data[urlVarName] = splitedUrl[i];
                        }

                    }
                    else if (splitedUrl[i] !== splitedPattern[i]) {
                        return false
                    }
                }
                return true;
            }
            return false;
        }

        public getData(): IRouteInfo {
            return this._data;
        }
    }

    export class RouteCollection {

        public routes: Array<Route>;

        constructor() {
            this.routes = [];
        }

        public addRoute(name: string, pattern: string, defaults?: any) {
            this.routes.push(new Route(name, pattern, defaults));
        }

        public getRouteByUrl(url: string): IRouteInfo {

            for (var i = 0; i < this.routes.length; i++) {
                var route = this.routes[i];
                if (route.match(url)) {
                    return route.getData();
                }
            }

            return null;
        }


    }
}

export = internal;