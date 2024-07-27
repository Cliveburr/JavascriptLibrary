import { PortraitModel } from '../../framework';

export interface ProfileRegisterModel {
    nickName: string;
    fullName: string;
    email: string;
    password: string;
}

export enum SessionType {
    WebApi = 0
}

export interface IProfileViewModel {
    _id: string;
    nickName: string;
    name: string;
    email: string;
    portrait: PortraitModel;
}

export interface IProfileHomeModel {
    name: string;
}
