import { EntityBase, ObjectId } from '@seven/framework';

export interface CommissionedEntity extends EntityBase {
    relationId: ObjectId;
    commissionsOpen: ObjectId[];
}
