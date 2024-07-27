import { AuthenticationByPasswordRequest, AuthenticationByTokenRequest, AuthenticationResponse } from "../model";

export abstract class ISecurityService {
    abstract authenticationByLogin(request: AuthenticationByPasswordRequest): Promise<AuthenticationResponse>;
    abstract authenticationByToken(request: AuthenticationByTokenRequest): Promise<AuthenticationResponse>;
    abstract logoff(): Promise<void>;
}