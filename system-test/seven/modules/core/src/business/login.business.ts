import { Injectable } from 'providerjs';
import { Assert, Session } from '@seven/framework';
import * as uuid from 'uuid';
import { AuthenticationResponse, AuthenticationByPasswordRequest, PortraitModel, PortraitType, AuthenticationByTokenRequest } from '../model';
import { CoreDatabase } from '../dataaccess/core.database';
import { SessionEntity } from '../entity/session.entity';
import { ProfileEntity } from '../entity';
import { BusinessEvent } from './interception/business.decorators';

@Injectable()
export class LoginBusiness {

    public constructor(
        private core: CoreDatabase,
        private session: Session
    ) {
    }

    @BusinessEvent()
    public async authenticationByLogin(request: AuthenticationByPasswordRequest): Promise<AuthenticationResponse> { 
        
        const profileAccess = await this.core.profile;
        const profile = await profileAccess.getByLogin(request.login);
        Assert.mustNotNull(profile, 'Login or password invalid!');

        const loginAccess = await this.core.login;
        const login = await loginAccess.getByPassword(profile._id, request.password);
        Assert.mustNotNull(login, "Login or password invalid!");

        const sessionAccess = await this.core.session;
        await sessionAccess.invalidateSessions(profile._id, request.sessionType);

        const session: SessionEntity = {
            _id: <any>undefined,
            createDateTime: Date.now(),
            isActive: true,
            profilePrivateId: profile._id,
            type: request.sessionType,
            token: uuid.v4(),
            ip6: request.ip6
        }
        sessionAccess.insertOne(session);

        this.session.profileId = profile._id;

        return {
            token: session.token,
            profile: {
                name: profile.name,
                nickName: profile.nickName,
                portrait: LoginBusiness.preparePortrail(profile)
            }
        };
    }

    @BusinessEvent()
    public async authenticationByToken(request: AuthenticationByTokenRequest): Promise<AuthenticationResponse> { 

        const sessionAccess = await this.core.session;
        const session = await sessionAccess.getByToken(request.sessionType, request.token, request.ip6);
        Assert.mustNotNull(session, 'Invalid session!');

        const profileAccess = await this.core.profile;
        const profile = await profileAccess.findOneById(session.profilePrivateId);
        Assert.mustNotNull(profile, 'Invalid session!');

        this.session.profileId = profile._id;

        return {
            token: session.token,
            profile: {
                name: profile.name,
                nickName: profile.nickName,
                portrait: LoginBusiness.preparePortrail(profile)
            }
        };
    }

    @BusinessEvent()
    public async logoff(): Promise<void> {


    }

    public static preparePortrail(profile: ProfileEntity): PortraitModel {
        if (profile.portrait) {
            return profile.portrait;
        }
        else {
            return {
                type: PortraitType.TwoLetter,
                twoLetter: {
                    twoLetter: profile.name.substr(0, 2),
                    backColor: 'light',
                    borderColor: 'secondary',
                    foreColor: 'primary'
                }
            }
        }
    }
}
