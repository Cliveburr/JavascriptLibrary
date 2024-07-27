import { SessionType } from '../entity/session.entity';
import { PortraitModel } from './portrait.model';

export { SessionType } from '../entity/session.entity';

export interface AuthenticationByPasswordRequest {
    login: string;
    password: string;
    sessionType: SessionType;
    ip6: string;
}

export interface AuthenticationByTokenRequest {
    token: string;
    sessionType: SessionType;
    ip6: string;
}

export interface AuthenticationResponse {
    token: string;
    profile: Profile;
}

export interface Profile {
    name: string;
    nickName: string;
    portrait: PortraitModel;
}

export interface IProfileViewModel {
    _id: string;
    nickName: string;
    name: string;
    email: string;
    portrait: PortraitModel;
}
