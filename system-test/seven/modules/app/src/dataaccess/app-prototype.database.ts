import { Injectable } from 'providerjs';
import { DataAccess, ObjectId, ILoaderRequest, ILoaderResponse, UpdateWriteOpResult } from '@seven/framework';
import { AppInstanceEntity, AppPrototypeEntity } from '../entity';

@Injectable()
export class AppPrototypeDataAccess extends DataAccess<AppPrototypeEntity> {

    public constructor() {
        super('AppPrototype')
    }

    public create(entity: AppPrototypeEntity) {
        return this.insertOne(entity)
    }

    public appsTable(request: ILoaderRequest) {
        return this.loader(request, [], undefined);
    }

    public appsView(request: ILoaderRequest, profileId: ObjectId) {
        const query = [
            {
                $lookup: {
                    from: 'AppInstance',
                    localField: '_id',
                    foreignField: 'prototypeId',
                    as: 'instances'
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    usage: 1,
                    code: 1,
                    shortName: 1,
                    hasInstance: {
                        $cond: {
                            if: {
                                $arrayElemAt: {
                                    $filter: {
                                        input: '$instances',
                                        as: 'instance',
                                        cond: { $eq: [ '$$instance.profileId', profileId ] }
                                    }
                                }
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        ];
        return this.loader(request, query);
    }

    public updateUsage(prototypeId: ObjectId) {
        const query = {
            _id: prototypeId
        }
        const update = {
            $inc: {
                'usage': 1
            }
        }
        return this.updateOne(query, update);
    }
}