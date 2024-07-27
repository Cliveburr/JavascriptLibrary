import { Injectable } from 'providerjs';
import { DataAccess, ObjectId, ILoaderRequest, ILoaderResponse, InsertWriteOpResult } from '@seven/framework';
import { AppInstanceEntity, AppPrototypeEntity } from '../entity';

@Injectable()
export class AppInstanceDataAccess extends DataAccess<AppInstanceEntity> {

    public constructor() {
        super('AppInstance')
    }

    public getInstalled(prototypeId: ObjectId, profileId: ObjectId) {
        const query = {
            prototypeId,
            profileId
        };
        return this.findOne(query);
    }

    public appsView(request: ILoaderRequest) {
        return this.loader(request, []);
    }

    public getInstalledByCode(code: number, profileId: ObjectId) {
        const query = [
            {
                $lookup: {
                    from: 'AppPrototype',
                    localField: 'prototypeId',
                    foreignField: '_id',
                    as: 'prototypes'
                }
            },
            {
                $match: {
                    profileId,
                    'prototypes.0.code': code
                }
            }
        ];
        return this.aggreFindOne(query);
    }
}