import { CreatePrivateWithPasswordRequest, ProfileHomeModel } from "../model/profile.model";
import { CoreDatabase } from '../dataaccess/core.database';
import { ProfileEntity, ProfileType } from '../entity/profile.entity';
import { LoginEntity, LoginType } from '../entity/login.entity';
import { ILoaderRequest, ILoaderResponse, Session, ObjectId, Assert, ILoaderFilterType } from '@seven/framework';
import { IProfileViewModel, RelationProfileModel, LocationProfile } from '../model';
import { LoginBusiness } from './login.business';
import { BusinessClass, BusinessEvent } from './interception/business.decorators';

@BusinessClass()
export class ProfileBusiness {

    private loginInvalidChars = /[\ ]/;
    private loginReservedNames = ['site', 'profile', 'profiles', 'desktop'];

    public constructor(
        private core: CoreDatabase,
        private session: Session
    ) {
    }
    
    @BusinessEvent()
    public async createPrivateWithPassword(request: CreatePrivateWithPasswordRequest): Promise<void> {

        const nickValidation = await this.validedNickName(request.nickName);
        if (nickValidation) {
            throw nickValidation;
        }

        const profileAccess = await this.core.profile;
        const loginAccess = await this.core.login;

        const profile: ProfileEntity = {
            _id: <any>undefined,
            type: ProfileType.Private,
            nickName: request.nickName,
            name: request.fullName,
            email: request.email,
            private: {
            }
        }
        await profileAccess.insertOne(profile);

        const login: LoginEntity = {
            _id: <any>undefined,
            profilePrivateId: profile._id,
            type: LoginType.Password,
            password: {
                current: request.password
            }
        }
        await loginAccess.insertOne(login);
    }

    @BusinessEvent()
    public async validedNickName(nickName: string): Promise<string | null> {

        if (this.loginReservedNames.indexOf(nickName.toLocaleLowerCase()) > -1) {
            return 'Apelido inválido!';
        }

        if (this.loginInvalidChars.test(nickName)) {
            return 'Caracter inválido!';
        }

        if (nickName.length < 3) {
            return 'Apelido muito pequeno! Minimo de 3 caracteres!';
        }

        if (nickName.length > 15) {
            return 'Apelido muito grande! Maximo de 15 caracteres!';
        }

        const profileAccess = await this.core.profile;

        const profile = await profileAccess.getByNickName(nickName);

        return profile ? 'Apelido já usado!' : null;
    }

    @BusinessEvent({ locationProfile: true })
    public async resolveProfileHome(profile: LocationProfile): Promise<ProfileHomeModel> {
        return {
            name: profile.name
        }
    }

    @BusinessEvent({ locationProfile: true, security: 'core.profile.read' })
    public async resolveProfileView(lprofile: LocationProfile): Promise<IProfileViewModel> {

        const profileAccess = await this.core.profile;
        const profile = await profileAccess.findOneById(lprofile._id);
        Assert.mustNotNull(profile, 'Perfil não encontrado!');

        return {
            _id: profile._id.toHexString(),
            name: profile.name,
            nickName: profile.nickName,
            email: profile.email,
            portrait: LoginBusiness.preparePortrail(profile)
        }
    }

    @BusinessEvent()
    public async loaderProfiles(request: ILoaderRequest) { 
        const profileAccess = await this.core.profile;
        return await profileAccess.loaderProfiles(request, this.session.profileId);
    }



    @BusinessEvent()
    public async getByNickName(nickName?: string) {
        const profileAccess = await this.core.profile;
        const profile = await profileAccess.getByNickName(nickName);
        Assert.mustNotNull(profile, 'Perfil não encontrado!');
        return profile;
    }

    // @BusinessEvent()
    // public async adminProfileTable(request: ILoaderRequest) { 
    //     const profileAccess = await this.core.profile;
    //     return await profileAccess.adminProfileTable(request);
    // }

    // @BusinessEvent()
    // public async adminSessionTable(request: ILoaderRequest): Promise<ILoaderResponse> { 
    //     const sessionAccess = await this.core.session;
    //     return await sessionAccess.adminSessionTable(request);
    // }

    // @BusinessEvent()
    // public async adminLoginTable(request: ILoaderRequest): Promise<ILoaderResponse> { 
    //     const loginAccess = await this.core.login;
    //     return await loginAccess.adminLoginTable(request);
    // }

    // @BusinessEvent()
    // public async getProfileRelationsModel(nickName: string): Promise<ProfileRelationsModel> {
        
    //     const profileAccess = await this.core.profile;
    //     const profile = await profileAccess.getByNickName(nickName);
    //     Assert.mustNotNull(profile, 'Perfil não encontrado!');

    //     return {
    //         canEditRelations: this.session.profileId.equals(profile._id)
    //     }
    // }

    // @BusinessEvent()
    // public async relationProfileSelect(request: ILoaderRequest): Promise<ILoaderResponse> { 

    //     const profileAccess = await this.core.profile;
    //     const profile = await profileAccess.getByNickName(request.nickName);
    //     Assert.mustNotNull(profile, 'Perfil não encontrado!');

    //     const relationAccess = await this.core.relation;
    //     return await relationAccess.relationProfileSelect(request, profile._id, true);
    // }

    // @BusinessEvent()
    // public async getRelationProfileModel(profileId: ObjectId, ids: ObjectId[]) {
    //     const relationAccess = await this.core.relation;
    //     return (await relationAccess.relationProfileSelect({
    //         pos: 0,
    //         count: ids.length,
    //         filters: [
    //             {
    //                 type: ILoaderFilterType.ContainsObjectId,
    //                 property: '_id',
    //                 value: ids
    //             }
    //         ]
    //     }, profileId, false)).items;
    // }

    @BusinessEvent()
    public async saveProfile(model: IProfileViewModel): Promise<void> {
        
        const profileAccess = await this.core.profile;
        const profileId = new ObjectId(model._id);
        const profile = await profileAccess.findOneById(profileId);
        Assert.mustNotNull(profile, 'Perfil não encontrado!');

        profile.portrait = model.portrait;

        await profileAccess.updateSelf(profile);
    }
}