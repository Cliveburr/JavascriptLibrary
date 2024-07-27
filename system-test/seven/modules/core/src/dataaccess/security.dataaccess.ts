import { Injectable } from 'providerjs';
import { ObjectId, DataAccess, ILoaderResponse, ILoaderRequest } from '@seven/framework';
import { SecurityEntity } from '../entity/security.entity';

@Injectable()
export class SecurityDataAccess extends DataAccess<SecurityEntity> {

    public constructor() {
        super('Security')
    }
}