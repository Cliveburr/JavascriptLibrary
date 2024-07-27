import { Injectable, Injector, Type } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class ModelIdResolver implements Resolve<any> {

    public constructor(
        private injector: Injector
    ) {
    }

    public  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const data = <IModelIdResolverData>route.data;
        const service = this.injector.get(<Type<any>>data.service, 'Invalid route service for ModelIdResolver! Url: ' + route.url);
        const method = data.getMethod(service);
        const id = 'id' in route.params ? route.params['id'] : undefined;
        return method(id);
    }
}

export interface IModelIdResolverData {
    service: Object;
    getMethod: <T>(obj: T) => ((id: string) => Promise<any>);
}