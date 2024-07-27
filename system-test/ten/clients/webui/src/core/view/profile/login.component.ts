import { Component } from '@angular/core';
import { sha256 } from 'js-sha256';
import { AuthenticationByPasswordRequest } from 'src/core';
import { LoginService } from '../../service';

@Component({
    templateUrl: './login.component.html'
})
export class ProfileLoginComponent {

    public model: AuthenticationByPasswordRequest;
    public rememberMe: boolean = false;

    public constructor(
        private loginService: LoginService
    ) {
        this.model = <any>{};
    }

    public login(): void {

        const securityPass = sha256.hex(this.model.password);

        this.loginService.base.withLoadingNav(
            this.loginService.authenticationByLogin({
                login: this.model.login,
                password: securityPass
            }),
            '/site'
        );
    }
}
