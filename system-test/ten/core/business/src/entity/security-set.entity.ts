import { EntityBase, ObjectId } from '@ten/framework_business';

export interface SecuritySetEntity extends EntityBase {
    profileId: ObjectId;
    visitorProfileId: ObjectId;
    domain: string;
    sets: string;
}