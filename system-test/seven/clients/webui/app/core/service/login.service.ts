import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256';
import { BaseService, IPath, WebSocketService } from '../../framework';
import { IAuthenticationResponse, IAuthenticationByPasswordRequest, IAuthenticationByTokenRequest } from '../model';

@Injectable()
export class LoginService {

    private login: IPath;

    public constructor(
        public base: BaseService,
        webSocketService: WebSocketService
    ) {
        this.login = webSocketService.openPath('core.login');
        webSocketService.handleOnReconnectEvent.subscribe(this.handleOnReconnect.bind(this));
    }

    public async authenticationByLogin(login: string, password: string): Promise<void> {
        const response = await this.login.call<IAuthenticationResponse>('authenticationByLogin', <IAuthenticationByPasswordRequest>{
            login,
            password: sha256.hex(password),
            ip6: '',
            sessionType: 0
        });
        this.base.session.startSession(response);
    }

    public async authenticationByToken(): Promise<void> {
        const token = this.base.store.read<string>(this.base.session.SESSIONTOKEN);
        if (token) {
            try {
                const response = await this.login.call<IAuthenticationResponse>('authenticationByToken', <IAuthenticationByTokenRequest>{
                    token,
                    ip6: '',
                    sessionType: 0
                });
                this.base.session.startSession(response);
            } 
            catch {
                this.logoff();
            }
        }
    }

    public async logoff(): Promise<void> {
        await this.login.call('logoff');
        this.base.session.endSession();
    }

    public async handleOnReconnect(): Promise<void> {
        await this.authenticationByToken();
        let currentUrl = this.base.router.url;
        this.base.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.base.router.navigate([currentUrl]);
        });
    }
}
