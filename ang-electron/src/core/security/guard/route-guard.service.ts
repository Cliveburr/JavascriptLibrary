import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ProfileService } from '../../service/index';

@Injectable()
export class PublicRouterGuard implements CanActivateChild {

    public constructor(
        private router: Router,
        private profileService: ProfileService
    ) {
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.warn('PublicRouterGuard');
        return this.profileService.isLogged
             .map(isLogged => !isLogged)
             .do(isLogged => {
                if (!isLogged)
                    this.router.navigateByUrl('dashboard');
            });
    }
}

@Injectable()
export class PrivateRouterGuard implements CanActivateChild  {

    public constructor(
        private router: Router,
        private profileService: ProfileService
    ) {
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.warn('PrivateRouterGuard');
        return this.profileService.isLogged
            .do(isLogged => {
                if (!isLogged)
                    this.router.navigateByUrl('home');
            });
    }
}

@Injectable()
export class StartPageGuard implements CanActivate {

    public constructor(
        private router: Router,
        private profileService: ProfileService
    ) {
    }

    public canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.warn('StartPageGuard');
        return this.profileService.isLogged
            .do(isLogged => {
                if (isLogged) {
                    this.router.navigateByUrl('dashboard');
                }
                else {
                    this.router.navigateByUrl('home');
                }
            });
    }
}

// @Injectable()
// export class PrivateRouterGuardDeactive implements CanDeactivate<any> {

//     private justOne: boolean;

//     public constructor(
//     ) {
//     }

//     public canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//         console.warn('PrivateRouterGuardDeactive');
//         return true;
//     }
// }