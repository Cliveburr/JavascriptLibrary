import { Injectable } from 'providerjs';
import { ObjectId, DataAccess, ILoaderResponse, ILoaderRequest, ILoaderFilterType } from '@seven/framework';
import { ProfileEntity, ProfileType } from '../entity/profile.entity';
import { LocationProfile } from '../model';

@Injectable()
export class ProfileDataAccess extends DataAccess<ProfileEntity> {

    public constructor() {
        super('Profile')
    }

    public getByLogin(login: string) {
        const query = {
            type: ProfileType.Private,
            $or: [
                { nickName: { $regex: new RegExp(`^${login}$`, "i") } },
                { email: { $regex: new RegExp(`^${login}$`, "i") } }
            ]
        }
        return this.findOne(query);
    }
    
    public getByNickName(nickName?: string) {
        const query = {
            type: ProfileType.Private,
            nickName: { $regex: new RegExp(`^${nickName}$`, "i") }
        }
        return this.findOne(query);
    }

    public async getLocationProfile(profile?: string): Promise<LocationProfile | null> {
        const pipeline = [
            {
                $match: {
                    nickName: profile
                }
            },
            {
                $project: {
                    nickName: 1,
                    name: 1
                }
            }
        ]
        return this.aggreFindOne(pipeline);
    }

    // public adminProfileTable(request: ILoaderRequest): Promise<ILoaderResponse> {
    //     return this.loadContent(request, undefined, [{ "$project": {
    //         "name": 1,
    //         "email": 1
    //     } }]);
    // }

    public loaderProfiles(request: ILoaderRequest, profileId: ObjectId) {
        const query = [
            {
                $match: {
                    _id: { $ne: profileId },
                    name: this.applyRegexValueFilter(request, 'name')
                }
            }
        ];
        const end = [
            {
                $lookup: {
                    from: 'Relation',
                    localField: '_id',
                    foreignField: 'realProfileId',
                    as: 'relation'
                }
            },
            {
                $project: {
                    name: 1,
                    nickName: 1,
                    portrait: 1,
                    relation: {
                        $anyElementTrue: {
                            $filter: {
                                input: '$relation',
                                as: 'relation',
                                cond: {
                                    $and: [
                                        { $eq: [ "$$relation.profileId", profileId ] },
                                        { $not: { $eq: [ "$$relation.state", 4 ] } }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ];
        return this.loader(request, query, end);
    }
}