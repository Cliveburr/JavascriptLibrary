import { Injectable } from 'providerjs';
import { DataAccess, ObjectId } from '@seven/framework';
import { SessionEntity, SessionType } from '../entity/session.entity';

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

    public getByToken(type: SessionType, token: string, ip6: string) {
        const query = {
            type,
            token,
            isActive: true,
            ip6
        }
        return this.findOne(query);
    }
    
    // public adminSessionTable(request: ILoaderRequest): Promise<ILoaderResponse> {
    //     return this.loadContent(request, undefined, [{ "$project": {
    //         "type": 1,
    //         "token": 1,
    //         "isActive": 1,
    //         "ip6": 1,
    //         "createDateTime": 1,
    //         "endDateTime": 1
    //     } }]);
    // }
}