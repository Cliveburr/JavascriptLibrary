import { Injectable } from 'providerjs';
import { DataAccess, ObjectId, ILoaderRequest, ILoaderResponse } from '@seven/framework';
import { SaleEntity } from '../entity';

@Injectable()
export class SaleDataAccess extends DataAccess<SaleEntity> {

    public constructor() {
        super('Sale')
    }
    
    public loaderSales(request: ILoaderRequest, appInstanceId: ObjectId) {
        const query = [
            {
                $match: {
                    appInstanceId
                }
            }
        ];
        const end = [
            {
                $project: {
                    createdDatetime: 1,
                    alias: 1,
                    total: 1
                }
            }
        ];
        return this.loader(request, query, end);
    }
}