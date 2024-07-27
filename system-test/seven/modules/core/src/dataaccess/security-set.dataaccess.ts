import { Injectable } from 'providerjs';
import { ObjectId, DataAccess, ILoaderResponse, ILoaderRequest } from '@seven/framework';
import { SecuritySetEntity } from '../entity/security-set.entity';

@Injectable()
export class SecuritySetDataAccess extends DataAccess<SecuritySetEntity> {

    public constructor() {
        super('SecuritySet')
    }

    public async getSecuritySet(profileId: ObjectId, visitorProfileId: ObjectId, domain: string)  {
        const query = {
            profileId,
            visitorProfileId,
            domain
        }
        return this.findOne(query);
    }
}