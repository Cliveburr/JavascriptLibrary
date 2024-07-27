import { Injectable, Injector, Type } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ILoaderRequest } from '../model';
import { Observable } from 'rxjs';

@Injectable()
export class TableResolver implements Resolve<any> {

    public constructor(
        private injector: Injector
    ) {
    }

    public  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const data = <ITableResolverData>route.data;
        const service = this.injector.get(<Type<any>>data.service, 'Invalid route service for TableResolver! Url: ' + route.url);
        const method = data.getMethod(service);
        return method({
            pos: 0,
            count: 5
        });
    }
}

export interface ITableResolverData {
    service: Object;
    getMethod: <T>(obj: T) => ((request: ILoaderRequest) => Promise<any>);
}