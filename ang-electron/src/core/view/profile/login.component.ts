import { Component } from '@angular/core';
import { BaseView } from '../../../common/index';
import { ProfileService } from '../../service/index';

@Component({
    templateUrl: 'login.component.html',
    providers: [BaseView]
})
export class LoginComponent {

    public constructor(
        private base: BaseView,
        public profileService: ProfileService
    ) {
    }

    public doLogin(): void {
        this.profileService.setLogged(true);
        this.base.router.navigateByUrl('/');
    }
}