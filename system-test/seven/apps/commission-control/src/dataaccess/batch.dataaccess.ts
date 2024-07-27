import { Injectable } from 'providerjs';
import { DataAccess } from '@seven/framework';
import { BatchEntity } from '../entity';

@Injectable()
export class BatchDataAccess extends DataAccess<BatchEntity> {

    
}