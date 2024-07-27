import { EntityBase, ObjectId } from '@ten/framework_business';

export interface SecurityActors {
    relationId?: ObjectId;
    groupId?: ObjectId;
    actions: { [key: number]: string };
}

export interface SecurityEntity extends EntityBase {
    profileId: ObjectId;
    path: string;
    actors: SecurityActors[];
}