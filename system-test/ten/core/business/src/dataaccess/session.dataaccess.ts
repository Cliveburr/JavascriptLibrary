import { Injectable } from 'providerjs';
import { DataAccess, ObjectId } from '@ten/framework_business';
import { SessionEntity, SessionType } from '../entity';

@Injectable()
export class SessionDataAccess extends DataAccess<SessionEntity> {

    public constructor() {
        super('Session')
    }

    public invalidateSessions(profilePrivateId: ObjectId, type: SessionType) {
        const query = {
            profilePrivateId: profilePrivateId,
            type,
            isActive: true
        }
        const update = {
            $set: {
                isActive: false,
                endDateTime: Date.now()
            }
        }
        return this.updateMany(query, update);
    }

    public getActiveByToken(type: SessionType, token: string, ip6: string) {
        const query = {
            type,
            token,
            isActive: true,
            ip6
        }
        return this.findOne(query);
    }
}