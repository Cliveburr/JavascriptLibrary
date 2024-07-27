import { Injectable } from 'providerjs';
import { DataAccess, ObjectId, ILoaderRequest } from '@seven/framework';
import { RelationEntity, RelationType, RelationState } from '../entity';
import { LoaderProfileRelationsResponse, LoaderRelationSelect } from '../model';

@Injectable()
export class RelationDataAccess extends DataAccess<RelationEntity> {

    public constructor() {
        super('Relation')
    }

    // public create(...entity: RelationEntity[]): Promise<InsertWriteOpResult<RelationEntity>> {
    //     return this.collection.insertMany(entity);
    // }

    // public update(relationId: ObjectId, entity: RelationEntity): Promise<UpdateWriteOpResult> {
        
    //     const query = {
    //         "_id": relationId
    //     }

    //     return this.collection.replaceOne(query, entity);
    // }

    public updateRelation(profileId: ObjectId | undefined, realProfileId: ObjectId | undefined, onState: RelationState | RelationState[], toState: RelationState) {
        const onStateQuery = Array.isArray(onState) ?
            { $in: onState } :
            onState;
        const query = {
            profileId: profileId,
            type: RelationType.Real,
            state: onStateQuery,
            realProfileId: realProfileId
        }
        const update = {
            $set: {
                state: toState
            },
            $push: {
                history: {
                    state: toState,
                    date: new Date(Date.now())
                }
            }
        }
        return this.updateOne(query, update);
    }

    public getReal(profileId: ObjectId, realProfileId: ObjectId) {
        const query = {
            profileId: profileId,
            type: RelationType.Real,
            realProfileId: realProfileId
        }
        return this.findOne(query);
    }

    public getOut(profileId: ObjectId, relationId: ObjectId) {
        const query = {
            _id: relationId,
            profileId: profileId,
            type: RelationType.Out
        }
        return this.findOne(query);
    }

    public loaderProfileRelations(request: ILoaderRequest, profileId: ObjectId) {
        const stateFilter = request.filters
            ?.find(f => f.code == 'state');
        let stateIn: any[] = [1, 2, 3];
        switch (stateFilter?.value) {
            case 1: stateIn = [2]; break;
            case 2: stateIn = [4]; break;
        }
        const query = [
            {
                $match: {
                    profileId: profileId,
                    state: { $in: stateIn },
                    name: this.applyRegexValueFilter(request, 'name'),
                    email: this.applyRegexValueFilter(request, 'email')
                }
            }
        ];
        const end = [
            {
                $lookup: {
                    from: 'Profile',
                    localField: 'realProfileId',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $set: {
                    profile: {
                        $cond: {
                            if: {
                                $eq: [ '$type', RelationType.Real ]
                            },
                            then: { $arrayElemAt: [ '$profile', 0 ] },
                            else: '$outProfile'
                        }
                    }
                }
            },
            {
                $project: {
                    type: 1,
                    state: 1,
                    realProfileId: '$profile._id',
                    name: '$profile.name',
                    email: '$profile.email',
                    portrait: '$profile.portrait'
                }
            }
        ];
        return this.loader<LoaderProfileRelationsResponse>(request, query, end);
    }

    public relationProfileSelect(request: ILoaderRequest, profileId: ObjectId) {
        const query = [
            {
                $match: {
                    _id: this.applyNotContainsObjectIdFilter(request, 'avoids'),
                    profileId
                }
            },
            {
                $lookup: {
                    from: 'Profile',
                    localField: 'realProfileId',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $set: {
                    profile: {
                        $cond: {
                            if: {
                                $eq: [ '$type', RelationType.Real ]
                            },
                            then: { $arrayElemAt: [ '$profile', 0 ] },
                            else: '$outProfile'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: '$profile.name',
                    portrait: '$profile.portrait'
                }
            },
            {
                $match: {
                    name: this.applyRegexValueFilter(request, 'name')
                }
            }
        ];
        return this.loader<LoaderRelationSelect>(request, query);
    }
}