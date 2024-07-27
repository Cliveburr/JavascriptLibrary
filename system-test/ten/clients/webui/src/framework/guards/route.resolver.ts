import { Injectable, Injector, Type } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from "@angular/router";
import { deepMerge } from "..";
import { SessionService, LoadingService, WebSocketService } from "../service";

export interface IProfileResolverData {
    service: Type<any>;
    method: string;
}

@Injectable()
export class ProfileResolver implements Resolve<any> {

    public constructor(
        private sessionService: SessionService,
        private injector: Injector,
        private router: Router,
        private loadingService: LoadingService,
        private webSocketService: WebSocketService
    ) {
    }

    public async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        this.loadingService.show();

        const data = <IProfileResolverData>route.data;
        if (!data) {
            this.loadingService.hide();
            throw 'ProfileResolver with empty data!';
        }

        const service = this.injector.get(data.service, 'Invalid route service for ProfileResolver! Url: ' + route.url);
        const param = <any>{};
        deepMerge(param, route.params, route.queryParams);
        delete param.profile;
        delete param.app;

        const nextProfile = route.url[0]?.path;
        const nextApp = route.url[1]?.path;
        this.webSocketService.setNextProfileApp(nextProfile, nextApp);

        const resolved = service[data.method].apply(service, [param]);

        return Promise.resolve(resolved)
            .then(this.buildData.bind(this))
            .catch(() => this.router.navigate(route.root.url))
            .finally(this.loadingService.hide.bind(this.loadingService));
    }

    private buildData(data: any): any {
        return {
            model: data,
            sessionProfile: this.sessionService.profile
        }
    }
}

export function routeResolve(path: string, component: Type<any>, service: any, method: string, ...params: string[]): Route {
    return {
        path,
        component,
        resolve: { resolved: ProfileResolver },
        data: <IProfileResolverData>{
            service,
            method
        }
    }
}