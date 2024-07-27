import * as uuid from 'uuid';
import { Assert, BusinessClass, BusinessEvent, BusinessCallContext } from "@ten/framework_business";
import { ISecurityService, AuthenticationByPasswordRequest, AuthenticationResponse, AuthenticationByTokenRequest } from '@ten/core_interface';
import { LoginDataAccess, ProfileDataAccess, SessionDataAccess } from "../dataaccess";
import { SessionEntity, SessionType } from "../entity";

const bcrypt = require('bcryptjs');

@BusinessClass()
export class SecurityBusiness extends ISecurityService {
    
    public constructor(
        private profileAccess: ProfileDataAccess,
        private loginAccess: LoginDataAccess,
        private sessionAccess: SessionDataAccess,
        private context: BusinessCallContext
    ) {
        super()
    }

    @BusinessEvent()
    public async authenticationByLogin(request: AuthenticationByPasswordRequest): Promise<AuthenticationResponse> {

        const profile = await this.profileAccess.getByLogin(request.login);
        Assert.mustNotNull(profile, 'Login or password invalid!');

        const login = await this.loginAccess.getPassword(profile._id);
        Assert.mustNotNull(login, 'Login or password invalid!');

        if (!bcrypt.hashSync(request.password, login.password?.current)) {
            throw 'Login or password invalid!';
        }

        await this.sessionAccess.invalidateSessions(profile._id, SessionType.WebApi);

        const session: SessionEntity = {
            _id: <any>undefined,
            createDateTime: Date.now(),
            isActive: true,
            profilePrivateId: profile._id,
            type: SessionType.WebApi,
            token: uuid.v4(),
            ip6: this.context.remoteAddress
        }
        const insertResult = await this.sessionAccess.insertOne(session);
        Assert.database.insertedOne(insertResult, 'Database error!');

        this.context.sessionProfileId = profile._id;

        return {
            token: session.token,
            profile: {
                name: profile.name,
                nickName: profile.nickName,
                portrait: profile.portrait
            }
        };
    }

    @BusinessEvent()
    public async authenticationByToken(request: AuthenticationByTokenRequest): Promise<AuthenticationResponse> { 

        const session = await this.sessionAccess.getActiveByToken(SessionType.WebApi, request.token, this.context.remoteAddress);
        Assert.mustNotNull(session, 'Invalid session!');

        const profile = await this.profileAccess.findOneById(session.profilePrivateId);
        Assert.mustNotNull(profile, 'Invalid session!');

        this.context.sessionProfileId = profile._id;

        return {
            token: session.token,
            profile: {
                name: profile.name,
                nickName: profile.nickName,
                portrait: profile.portrait
            }
        };
    }

    @BusinessEvent()
    public async logoff(): Promise<void> {

        Assert.mustNotNull(this.context.sessionProfileId, 'Invalid session!');

        const profile = await this.profileAccess.findOneById(this.context.sessionProfileId);
        Assert.mustNotNull(profile, 'Invalid session!');

        await this.sessionAccess.invalidateSessions(profile._id, SessionType.WebApi);
        this.context.sessionProfileId = undefined;
    }
}