import { EntityBase, ObjectId } from '@seven/framework';

export interface SecurityActors {
    relationId?: ObjectId;
    groupId?: ObjectId;
    perms: string;
}

export interface SecurityEntity extends EntityBase {
    profileId: ObjectId;
    name: string;
    actions: { [identify: string]: SecurityActors };
}