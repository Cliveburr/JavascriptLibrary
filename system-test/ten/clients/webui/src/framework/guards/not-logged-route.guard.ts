import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../service';

@Injectable()
export class NotLoggedRouterGuard implements CanActivate  {

    public constructor(
        private router: Router,
        private sessionService: SessionService
    ) {
    }
    
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (this.sessionService.isLogged) {
            return this.router.parseUrl('/site');
        }
        else {
            return true;            
        }
    }
}
