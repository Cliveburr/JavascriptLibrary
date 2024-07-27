import { CreatePrivateWithPasswordRequest, LoaderProfilesModel, ProfileViewResolve } from "../model";
import { ILoaderRequest, ILoaderResponse } from "@ten/framework_interface";

export abstract class IProfileService {
    abstract createPrivateWithPassword(request: CreatePrivateWithPasswordRequest): Promise<void>;
    abstract validedNickName(nickName: string): Promise<string | null>;
    abstract saveProfile(model: ProfileViewResolve): Promise<void>;
    abstract loaderProfiles(request: ILoaderRequest): Promise<ILoaderResponse<LoaderProfilesModel>>;
    abstract loaderProfilesForRelations(request: ILoaderRequest): Promise<ILoaderResponse<LoaderProfilesModel>>;
}