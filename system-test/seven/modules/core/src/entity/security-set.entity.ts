import { EntityBase, ObjectId } from '@seven/framework';

export interface SecuritySetEntity extends EntityBase {
    profileId: ObjectId;
    visitorProfileId: ObjectId;
    domain: string;
    sets: string;
}