import { EntityBase, ObjectId } from '@seven/framework';

export interface AppInstanceEntity extends EntityBase {
    profileId: ObjectId;
    prototypeId: ObjectId;
    configs: any;
}