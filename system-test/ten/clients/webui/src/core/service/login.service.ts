import { Injectable } from "@angular/core";
import { BaseService, WebSocketService } from "src/framework";
import { AuthenticationByPasswordRequest, ISecurityService } from ".";

@Injectable()
export class LoginService {

    public constructor(
        public base: BaseService,
        private securityBusiness: ISecurityService,
        webSocketService: WebSocketService
    ) {
        webSocketService.handleOnReconnectEvent.subscribe(this.handleOnReconnect.bind(this));
    }

    public async authenticationByLogin(model: AuthenticationByPasswordRequest): Promise<void> {
        const response = await this.securityBusiness.authenticationByLogin(model);
        this.base.session.startSession(response.token, response.profile);
    }

    public async authenticationByToken(): Promise<void> {
        const token = this.base.session.readSessionToken();
        if (token) {
            try {
                const response = await this.securityBusiness.authenticationByToken({
                    token
                });
                this.base.session.startSession(response.token, response.profile);
            } 
            catch {
                this.logoff();
            }
        }
    }

    public async logoff(): Promise<void> {
        await this.securityBusiness.logoff();
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