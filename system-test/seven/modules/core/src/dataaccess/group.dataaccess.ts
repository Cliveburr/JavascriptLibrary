import { Injectable } from 'providerjs';
import { ObjectId, DataAccess, ILoaderRequest } from '@seven/framework';
import { GroupEntity } from '../entity/group.entity';
import { LoaderProfileGroupsResponse, PortraitType, ProfileGroupMemberModel } from '../model';

@Injectable()
export class GroupDataAccess extends DataAccess<GroupEntity> {

    public constructor() {
        super('Group')
    }

    public loaderProfileGroups(request: ILoaderRequest, profileId: ObjectId) {
        const query = [
            {
                $match: {
                    _id: this.applyNotContainsObjectIdFilter(request, 'avoids'),
                    name: this.applyRegexValueFilter(request, 'name'),
                    profileId
                }
            }
        ];
        const end = [
            {
                $project: {
                    _id: 1,
                    name: 1,
                    portrait: 1
                }
            }
        ];
        return this.loader<LoaderProfileGroupsResponse>(request, query, end);
    }

    public getOne(profileId: ObjectId, groupId: ObjectId) {
        const query = {
            _id: groupId,
            profileId
        }
        return this.findOne(query);
    }

    public findGroupsWithMember(profileId: ObjectId, groupId: ObjectId) {
        const query = {
            profileId,
            members: {
                $elemMatch: {
                    type: 1,
                    groupId
                }
            }
        }
        return this.find(query);
    }

    public delete(profileId: ObjectId, groupId: ObjectId) {
        const query = {
            _id: groupId,
            profileId
        }
        return this.deleteOne(query);
    }

    public getGroupMembers(profileId: ObjectId, groupId: ObjectId) {
        const pipeline = [
            {
                $match: {
                    _id: groupId,
                    profileId
                }
            },
            {
                $unwind: {
                    path: '$members'
                }
            },
            {
                $replaceRoot: {
                    newRoot: '$members'
                }
            },
            {
                $lookup: {
                    from: 'Relation',
                    localField: 'relationId',
                    foreignField: '_id',
                    as: 'relation'
                }
            },
            {
                $unwind: {
                    path: '$relation',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'Profile',
                    localField: 'relation.realProfileId',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $set: {
                    profile: {
                        $cond: {
                            if: { $eq: [ '$relation.type', 0 ] },
                            then: { $arrayElemAt: [ '$profile', 0 ] },
                            else: '$relation.outProfile'
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'Group',
                    localField: 'groupId',
                    foreignField: '_id',
                    as: 'group'
                }
            },
            {
                $unwind: {
                    path: '$group',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: {
                        $cond: {
                            if:{ $eq: ["$type", 0] },
                            then: "$relation._id",
                            else: "$group._id"
                        }
                    },
                    type: 1,
                    name: {
                        $cond: {
                            if:{ $eq: ["$type", 0] },
                            then: "$profile.name",
                            else: "$group.name"
                        }
                    },
                    portrait: {
                        $cond: {
                            if: { $eq: ["$type", 0] },
                            then: "$profile.portrait",
                            else: "$group.portrait"
                        }
                    }
                }
            }
        ];
        return this.aggreFind<ProfileGroupMemberModel>(pipeline);
    }

    public allProfilesGroup: GroupEntity = {
        _id: <any>'allProfilesGroup00000000',
        profileId: new ObjectId(),
        name: 'Todos Profiles',
        portrait: {
            type: PortraitType.Icon,
            icon: {
                backColor: '',
                borderColor: '',
                foreColor: '',
                icon: ''
            }
        },
        members: []
    }

    public allRelationsGroup: GroupEntity = {
        _id: <any>'allRelationsGroup0000000',
        profileId: new ObjectId(),
        name: 'Todas Relações',
        portrait: {
            type: PortraitType.Icon,
            icon: {
                backColor: '',
                borderColor: '',
                foreColor: '',
                icon: ''
            }
        },
        members: []
    }

    public getSystemGroups(): GroupEntity[] {
        return [
            this.allProfilesGroup,
            this.allRelationsGroup
        ]
    }
}