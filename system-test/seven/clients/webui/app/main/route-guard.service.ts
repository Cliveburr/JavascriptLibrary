import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../framework';

@Injectable()
export class LoggedRouterGuard implements CanActivateChild  {

    public constructor(
        private router: Router,
        private sessionService: SessionService
    ) {
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.sessionService.isLogged) {
            return true;
        }
        else {
            this.router.navigateByUrl('/');
            return false;
        }
    }
}
