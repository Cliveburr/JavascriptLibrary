import { PortraitModel } from "@ten/framework_interface";

export interface CreatePrivateWithPasswordRequest {
    fullName: string;
    nickName: string;
    email: string;
    password: string;
}

export interface ProfileHomeResolve {
    canSecurity: boolean;
}

export interface ProfileViewResolve {
    _id: string;
    nickName: string;
    name: string;
    email: string;
    portrait: PortraitModel;
    isSessionProfile: boolean;
}

export interface LoaderProfilesModel {
    _id: string;
    name: string;
    nickName: string;
    portrait: PortraitModel;
}