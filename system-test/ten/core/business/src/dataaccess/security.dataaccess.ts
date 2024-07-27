import { DataAccess } from '@ten/framework_business';
import { Injectable } from 'providerjs';
import { SecurityEntity } from '../entity';

@Injectable()
export class SecurityDataAccess extends DataAccess<SecurityEntity> {

    public constructor() {
        super('Security')
    }
}