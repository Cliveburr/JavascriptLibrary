import { Injectable } from 'providerjs';
import { LoaderDataAccess, FilterOperations, ObjectId } from '@ten/framework_business';
import { ILoaderFilterType, ILoaderRequest } from '@ten/framework_interface';
import { ProfileEntity, ProfileType } from '../entity';
import { LoaderProfilesModel } from '@ten/core_interface';

interface RegexQuery {
    nickName: FilterOperations<string>;
    email: any;
}


@Injectable()
export class ProfileDataAccess extends LoaderDataAccess<ProfileEntity> {

    public constructor() {
        super('Profile')
    }
    
    public getByLogin(login: string) {

        //var nic: <FilterOperations<RegExp> = { $regex: new RegExp(`^${login}$`, "i") }

        const query = {
            type: ProfileType.Private,
            $or: <RegexQuery[]>[
                { nickName: { $regex: new RegExp(`^${login}$`, "i") } },
                { emailteste: { $regex: new RegExp(`^${login}$`, "i") } }
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

    public loaderProfiles(request: ILoaderRequest, profileId: ObjectId) {
        const filters = [
            {
                type: ILoaderFilterType.Regex,
                code: 0,
                property: 'name',
                regexPattern: '{{value}}',
                regexFlags: 'i'
            }
        ];
        const query = [
            {
                $match: {
                    _id: { $ne: profileId },
                    name: this.applyFilter(filters, request, 0)
                }
            }
        ];
        const end = [
            {
                $project: {
                    _id: 1,
                    name: 1,
                    nickName: 1,
                    portrait: 1,
                }
            }
        ];
        return this.loader<LoaderProfilesModel>(request, query, end);
    }

    public loaderProfilesForRelations(request: ILoaderRequest, profileId: ObjectId) {
        const filters = [
            {
                type: ILoaderFilterType.Regex,
                code: 0,
                property: 'name',
                regexPattern: '{{value}}',
                regexFlags: 'i'
            }
        ];
        const query = [
            {
                $match: {
                    _id: { $ne: profileId },
                    name: this.applyFilter(filters, request, 0)
                }
            },
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
                    _id: 1,
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
            },
            {
                $match: {
                    relation: false
                }
            }
        ];
        return this.loader<LoaderProfilesModel>(request, query);
    }
}
