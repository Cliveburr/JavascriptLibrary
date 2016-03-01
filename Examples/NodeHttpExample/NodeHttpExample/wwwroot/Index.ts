
module nhe {
    export var app = angular.module('app', ['ngRoute']);

    app.config((
        $locationProvider: ng.ILocationProvider,
        $routeProvider: any) => {        //ng.route.IRouteProvider

        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider
            .when('/', {
                templateUrl: 'Home/Index.html'
            })
            .otherwise({ redirectTo: '/' });

    });

    angular.element(document).ready(() => {
        angular.bootstrap(document, ['app']);
    });

    export function getScript(name: string, callBack: (err: string) => void): void {
        var script, head = document.head;

        script = document.createElement("script");
        script.async = true;
        script.src = name;

        script.onload = script.onreadystatechange = function (_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;

                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }

                script = null;

                if (isAbort)
                    callBack('Error loading script: {0}.'.format(name));
                else {
                    callBack(null);
                }
            }
        };

        script.onerror = () => {
            callBack('Error loading script: {0}.'.format(name));
        };

        head.insertBefore(script, head.firstChild);
    }
}