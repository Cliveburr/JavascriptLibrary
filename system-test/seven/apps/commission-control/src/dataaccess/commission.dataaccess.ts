import { Injectable } from 'providerjs';
import { DataAccess } from '@seven/framework';
import { CommissionEntity } from '../entity';

@Injectable()
export class CommissionDataAccess extends DataAccess<CommissionEntity> {

    public constructor() {
        super('Commission')
    }

}