import { CreatePrivateWithPasswordRequest, IProfileService, ProfileHomeResolve, ProfileViewResolve } from "@ten/core_interface";
import { Assert, BusinessCallContext, BusinessClass, BusinessEvent } from "@ten/framework_business";
import { ILoaderRequest, PortraitType } from '@ten/framework_interface';
import { LoginDataAccess, ProfileDataAccess } from "../dataaccess";
import { LoginEntity, LoginType, ProfileEntity, ProfileType } from "../entity";
import { SecurityService } from "./security.service";

@BusinessClass()
export class ProfileBusiness extends IProfileService {

    private loginInvalidChars = /[\ ]/;
    private loginReservedNames = ['site', 'profile', 'profiles', 'desktop'];

    public constructor(
        private context: BusinessCallContext,
        private profileAccess: ProfileDataAccess,
        private loginAccess: LoginDataAccess,
        private securityService: SecurityService
    ) {
        super()
    }
    
    @BusinessEvent()
    public async createPrivateWithPassword(request: CreatePrivateWithPasswordRequest): Promise<void> {

        const nickValidation = await this.validedNickName(request.nickName);
        if (nickValidation) {
            throw nickValidation;
        }

        const profile: ProfileEntity = {
            _id: <any>undefined,
            type: ProfileType.Private,
            nickName: request.nickName,
            name: request.fullName,
            email: request.email,
            portrait: {
                type: PortraitType.TwoLetter,
                twoLetter: {
                    twoLetter: request.nickName.substr(0, 2),
                    backColor: 'light',
                    borderColor: 'secondary',
                    foreColor: 'primary'
                }
            },
            private: {
            }
        }
        const profileInsert = await this.profileAccess.insertOne(profile);
        Assert.database.insertedOne(profileInsert, 'Database error!');

        const bcrypt = require('bcryptjs');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(request.password, salt);

        const login: LoginEntity = {
            _id: <any>undefined,
            profilePrivateId: profile._id,
            type: LoginType.Password,
            password: {
                salt,
                current: hash
            }
        }
        const loginInsert = await this.loginAccess.insertOne(login);
        Assert.database.insertedOne(loginInsert, 'Database error!');
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

        const profile = await this.profileAccess.getByNickName(nickName);

        return profile ? 'Apelido já usado!' : null;
    }

    @BusinessEvent({ security: 'core.home.read' })
    public async resolveProfileHome(arg: any): Promise<ProfileHomeResolve> {
        
        const profile = await this.profileAccess.getByNickName(this.context.locationProfile);
        Assert.mustNotNull(profile, 'Perfil não encontrado!');
        
        return {
            canSecurity: await this.securityService.checkAuthorized('core.home.security', this.context)
        }
    }

    @BusinessEvent({ security: 'core.profile.read' })
    public async resolveProfileView(): Promise<ProfileViewResolve> {

        const profile = await this.profileAccess.getByNickName(this.context.locationProfile);
        Assert.mustNotNull(profile, 'Perfil não encontrado!');

        return {
            _id: profile._id.toHexString(),
            name: profile.name,
            nickName: profile.nickName,
            email: profile.email,
            portrait: profile.portrait,
            isSessionProfile: profile._id.equals(this.context.sessionProfileId!)
        }
    }

    @BusinessEvent()
    public loaderProfiles(request: ILoaderRequest) {
        return this.profileAccess.loaderProfiles(request, this.context.sessionProfileId!);
    }

    @BusinessEvent()
    public loaderProfilesForRelations(request: ILoaderRequest) {
        return this.profileAccess.loaderProfilesForRelations(request, this.context.sessionProfileId!);
    }

    // @BusinessEvent()
    // public async getByNickName(nickName?: string) {
    //     const profileAccess = await this.core.profile;
    //     const profile = await profileAccess.getByNickName(nickName);
    //     Assert.mustNotNull(profile, 'Perfil não encontrado!');
    //     return profile;
    // }

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
    public async saveProfile(model: ProfileViewResolve): Promise<void> {
        
        const profile = await this.profileAccess.findOneById(model._id);
        Assert.mustNotNull(profile, 'Perfil não encontrado!');

        profile.portrait = model.portrait;

        const updated = await this.profileAccess.updateSelf(profile);
        Assert.database.updatedOne(updated, 'Database error!');
    }
}