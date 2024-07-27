import { Component } from '@angular/core';
import { LoginService } from 'app/core/service';
import { IPath, WebSocketService } from 'app/framework';

@Component({
    templateUrl: './home-site.component.html'
})
export class HomeSiteComponent {

    //private login: IPath;

    public constructor(
        //public loginService: LoginService
        //webSocketService: WebSocketService
    ) {
        //this.login = webSocketService.openPath('core.login');
    }

    public async test_click(): Promise<void> {
        // const ret = await this.loginService.call.authenticationByLogin('test', 'vai');
        // console.log(ret);
        //await this.login.call('authenticationByToken');
    }
}