import { EntityBase, ObjectId } from '@seven/framework';
import { PortraitModel } from '../model';

export enum GroupMemberType {
    IsRelation = 0,
    IsGroup = 1,
    IsSystemGroup = 2
}

export interface GroupMember {
    type: GroupMemberType;
    relationId?: ObjectId;
    groupId?: ObjectId;
}

export interface GroupEntity extends EntityBase {
    profileId: ObjectId;
    name: string;
    portrait: PortraitModel;
    members: GroupMember[];
}