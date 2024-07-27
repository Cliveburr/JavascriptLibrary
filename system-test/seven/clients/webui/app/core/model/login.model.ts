import { PortraitModel } from '../../framework';

export interface IAuthenticationByPasswordRequest {
    login: string;
    password: string;
    sessionType: 0;  // WebApi
    ip6: string;
}

export interface IAuthenticationByTokenRequest {
    token: string;
    sessionType: 0;  // WebApi
    ip6: string;
}

export interface IAuthenticationResponse {
    token: string;
    profile: {
        name: string;
        nickName: string;
        portrait: PortraitModel;
    };
}

export interface IProfile {
    name: string;
    nickName: string;
    portrait: PortraitModel;
}