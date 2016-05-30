
module internal {
    export interface IRouteService {
        routes: IRoute[];
        addRoute(name: string, pattern: string, defaults?: any): void;
        getRouteByUrl(url: string): IRouteInfo;
    }

    export interface IRoute {
        name: string
        pattern: string;
        defaults?: any;
    }

    export interface IRouteInfo {
        controller: string;
        action: string;
    }

    export class RouteService implements IRouteService {
        public routes: IRoute[];

        constructor() {
            this.routes = [];
        }

        public addRoute(name: string, pattern: string, defaults?: any): void {
            this.routes.push(new Route(name, pattern, defaults));
        }

        private match(url: string, route: IRoute): IRouteInfo {
            var data = {};
            var splitedUrl = url.split('/').removeAll('');
            var splitedPattern = route.pattern.split('/').removeAll('');

            if (splitedUrl.length > splitedPattern.length) {
                return null;
            } else {
                for (var i = 0, pattern: string; pattern = splitedPattern[i]; i++) {
                    if (Route.varRegex.test(pattern)) {
                        var urlVarName = Route.varRegex.exec(pattern)[1];
                        if (splitedUrl.length < i) {
                            if (route.defaults && urlVarName in route.defaults) {
                                data[urlVarName.srtrim('?')] = route.defaults[urlVarName];
                            } else if (urlVarName.endsWith('?')) {

                            } else {
                                return null;
                            }

                        } else {
                            data[urlVarName] = splitedUrl[i];
                        }

                    }
                    else if (splitedUrl[i] !== pattern) {
                        return null
                    }
                }
                return new RouteInfo(data);
            }
        }

        public getRouteByUrl(url: string): IRouteInfo {
            for (var i = 0, r: IRoute; r = this.routes[i]; i++) {
                var info = this.match(url, r);
                if (info)
                    return info;
            }
            return null;
        }
    }

    export class RouteInfo implements IRouteInfo {
        constructor(
            private _data) {
        }

        get controller(): string { return this._data['controller']; };
        get action(): string { return this._data['action']; };
    }

    export class Route implements IRoute {
        public static varRegex: RegExp = /^\{(.*?)\}$/i;

        constructor(
            public name: string,
            public pattern: string,
            public defaults?: any) {
        }
    }
}

export = internal;