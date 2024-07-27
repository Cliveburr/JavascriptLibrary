import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../service';

@Injectable()
export class LoggedRouterGuard implements CanActivateChild  {

    public constructor(
        private router: Router,
        private sessionService: SessionService
    ) {
    }
    
    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (this.sessionService.isLogged) {
            return true;            
        }
        else {
            return this.router.parseUrl('/site');
        }    
    }

}
