import { Injectable, Injector, Type } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService, LoadingService, SessionService, WebSocketService } from '../service';

export interface IGenericResolverData {
    params?: string[];
    services?: Object[];
    getMethod: (data: { params: string[], services: any[] }) => Observable<any> | Promise<any> | any;
}

@Injectable()
export class GenericResolver implements Resolve<any> {

    public constructor(
        private base: BaseService,
        private injector: Injector,
        private router: Router
    ) {
    }

    public async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const data = <IGenericResolverData>route.data;
        if (!data) {
            return undefined;
        }
        const getData = {
            params: <any[]>[],
            services: <any[]>[]
        };

        if (data.params) {
            for (const param of data.params) {
                if (param in route.params) {
                    getData.params.push(route.params[param]);
                }
            }
        }

        if (data.services) {
            for (const service of data.services) {
                const resolved = this.injector.get(<Type<any>>service, 'Invalid route service for GenericResolver! Url: ' + route.url);
                getData.services.push(resolved);
            }
        }

        const redirectUrl = '/' + this.base.session.profile!.nickName;
        const resolved = data.getMethod(getData);
        return Promise.resolve(resolved)
            .catch(err => this.router.navigateByUrl(redirectUrl));
    }
}



export interface IProfileResolverData {
    service: Type<any>;
    method: string;
    params: string[];
    redirectOnError?: string;
}

@Injectable()
export class ProfileResolver implements Resolve<any> {

    public constructor(
        private sessionService: SessionService,
        private injector: Injector,
        private router: Router,
        private webSocketService: WebSocketService,
        private loadingService: LoadingService
    ) {
    }

    public async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        this.loadingService.show();

        const data = <IProfileResolverData>route.data;
        if (!data) {
            throw 'ProfileResolver with empty data!';
        }

        const profile = <string | null>route.params['profile'];
        if (!profile) {
            throw 'ProfileResolver in url with not \'profile\' param!';
        }

        const service = this.injector.get(data.service, 'Invalid route service for ProfileResolver! Url: ' + route.url);
        const params = data.params
            .map(p => route.params[p]);
        if (!service[data.method]) {
            throw `Invalid method '${data.method}' for ProfileResolver! Url: ${route.url}`;
        }

        const nextProfile = route.url[0]?.path;
        const nextApp = route.url[1]?.path;
        this.webSocketService.setNextProfileApp(nextProfile, nextApp);

        const resolved = service[data.method].apply(service, params);

        return Promise.resolve(resolved)
            .then(data => { this.loadingService.hide(); return data; })
            .catch(err => {
                this.loadingService.hide();
                switch (data.redirectOnError) {
                    default:
                        this.router.navigateByUrl('/' + this.sessionService.profile!.nickName);
                }
            });
    }

}

export function makeProfileResolve(path: string, component: Type<any>, service: Type<any>, method: string, ...params: string[]): Route {
    return makeProfileResolveR(path, component, service, method, undefined, ...params);
}

export function makeProfileResolveR(path: string, component: Type<any>, service: Type<any>, method: string, redirectOnError?: string, ...params: string[]): Route {
    return {
        path,
        component,
        resolve: { resolved: ProfileResolver },
        data: <IProfileResolverData>{
            service,
            method,
            params,
            redirectOnError
        }
    }
}