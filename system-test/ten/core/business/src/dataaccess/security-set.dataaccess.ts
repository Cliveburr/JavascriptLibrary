import { Injectable } from 'providerjs';
import { DataAccess, ObjectId } from '@ten/framework_business';
import { SecuritySetEntity } from '../entity';

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