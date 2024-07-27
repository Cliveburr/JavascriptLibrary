import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256';
import { BaseService, ILoaderRequest, ILoaderResponse, IPath, WebSocketService } from '../../framework';
import { IProfileViewModel, IProfileHomeModel, ProfileRegisterModel, ProfileRelationsModel, RelationOutModel } from '../model';

@Injectable()
export class ProfileService {

    private profile: IPath;

    public constructor(
        public base: BaseService,
        webSocketService: WebSocketService
    ) {
        this.profile = webSocketService.openPath('core.profile');
    }

    public createProfile(request: ProfileRegisterModel): Promise<void> {
        return this.base.loading.withPromise(
            this.profile.call('createPrivateWithPassword', {
                nickName: request.nickName,
                fullName: request.fullName,
                email: request.email,
                password: sha256.hex(request.password)
            })
        );
    }

    public validedNickName(nickName: string): Promise<string | null> {
        return this.profile.call('validedNickName', nickName);
    }

    public resolveProfileHome(): Promise<IProfileHomeModel> {
        return this.profile.call('resolveProfileHome');
    }

    public resolveProfileView(): Promise<IProfileViewModel> {
        return this.profile.call('resolveProfileView');
    }
    
    public updateProfile(profile: IProfileViewModel): Promise<void> {
        return <any>undefined;
    }

    public loaderProfiles(request: ILoaderRequest): Promise<ILoaderResponse> {
        return this.profile.call('loaderProfiles', request);
    }


    public adminProfileTable(request: ILoaderRequest): Promise<ILoaderResponse> { return <any>undefined; }
    public adminSessionTable(request: ILoaderRequest): Promise<ILoaderResponse> { return <any>undefined; }
    public adminLoginTable(request: ILoaderRequest): Promise<ILoaderResponse> { return <any>undefined; }
    public getProfileRelationsModel(nickName: string): Promise<ProfileRelationsModel> { return <any>undefined; }
    public getRelationOutformModel(nickName: string, relationId: string): Promise<RelationOutModel> { return <any>undefined; }
    public relationProfileSelect(request: ILoaderRequest): Promise<ILoaderResponse> { return <any>undefined; }
}