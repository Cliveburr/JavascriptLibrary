import { LoaderProfileRelationsModel } from '@ten/core_interface';
import { LoaderDataAccess, ObjectId } from '@ten/framework_business';
import { ILoaderFilterType, ILoaderRequest } from '@ten/framework_interface';
import { Injectable } from 'providerjs';
import { RelationEntity, RelationType, RelationState } from '../entity';

@Injectable()
export class RelationDataAccess extends LoaderDataAccess<RelationEntity> {

    public constructor() {
        super('Relation')
    }

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
        const filters = [
            {
                type: ILoaderFilterType.Regex,
                code: 0,
                property: 'name',
                regexPattern: '{{value}}',
                regexFlags: 'i'
            },
            {
                type: ILoaderFilterType.Regex,
                code: 1,
                property: 'email',
                regexPattern: '{{value}}',
                regexFlags: 'i'
            }
        ];
        // const stateFilter = request.filters
        //     ?.find(f => f.code == 'state');
        let stateIn: any[] = [RelationState.Requested, RelationState.ToAccept, RelationState.Established];
        // switch (stateFilter?.value) {
        //     case 1: stateIn = [RelationState.ToAccept]; break;
        //     case 2: stateIn = [RelationState.Canceled]; break;
        // }
        const query = [
            {
                $match: {
                    profileId: profileId,
                    state: { $in: stateIn }
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
                $match: {
                    "profile.name": this.applyFilter(filters, request, 0),
                    "profile.email": this.applyFilter(filters, request, 1)
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
        return this.loader<LoaderProfileRelationsModel>(request, query);
    }

    // public relationProfileSelect(request: ILoaderRequest, profileId: ObjectId) {
    //     const query = [
    //         {
    //             $match: {
    //                 _id: this.applyNotContainsObjectIdFilter(request, 'avoids'),
    //                 profileId
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'Profile',
    //                 localField: 'realProfileId',
    //                 foreignField: '_id',
    //                 as: 'profile'
    //             }
    //         },
    //         {
    //             $set: {
    //                 profile: {
    //                     $cond: {
    //                         if: {
    //                             $eq: [ '$type', RelationType.Real ]
    //                         },
    //                         then: { $arrayElemAt: [ '$profile', 0 ] },
    //                         else: '$outProfile'
    //                     }
    //                 }
    //             }
    //         },
    //         {
    //             $project: {
    //                 _id: 1,
    //                 name: '$profile.name',
    //                 portrait: '$profile.portrait'
    //             }
    //         },
    //         {
    //             $match: {
    //                 name: this.applyRegexValueFilter(request, 'name')
    //             }
    //         }
    //     ];
    //     return this.loader<LoaderRelationSelect>(request, query);
    // }
}