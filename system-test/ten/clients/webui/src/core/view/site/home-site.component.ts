import { Component } from '@angular/core';
import { BaseService } from 'src/framework';
// import { LoginService } from 'app/core/service';
// import { IPath, WebSocketService } from 'app/framework';

@Component({
    templateUrl: 'home-site.component.html'
})
export class HomeSiteComponent {

    //private login: IPath;

    public constructor(
        public base: BaseService
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

    public changeStyle(color: 'blue' | 'dark') {
        this.base.changeStyle(color);
    }
}