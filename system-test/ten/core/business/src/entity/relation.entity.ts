import { EntityBase, ObjectId } from '@ten/framework_business';
import { ProfileEntity } from './profile.entity';

export enum RelationType {
    Real = 0,
    Out = 1
}

export enum RelationState {
    None = 0,
    Requested = 1,
    ToAccept = 2,
    Established = 3,
    Canceled = 4
}

export interface RelationHistory {
    state: RelationState;
    date: Date;
}

export interface RelationEntity extends EntityBase {
    profileId: ObjectId;
    type: RelationType;
    state: RelationState;
    history: RelationHistory[];
    realProfileId?: ObjectId;
    outProfile?: ProfileEntity;
}
