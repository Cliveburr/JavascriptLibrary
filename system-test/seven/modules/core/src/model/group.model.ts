import { ObjectId } from '@seven/framework';
import { GroupMemberType } from '../entity';
import { PortraitModel } from './portrait.model';

export interface ProfileGroupsResolve {
    name: string;
    canEditGroups: boolean;
}

export interface ProfileGroupMemberModel {
    _id: string;
    type: GroupMemberType;
    name: string;
    portrait: PortraitModel;
}

export interface ProfileGroupModel {
    _id: string;
    name: string;
    portrait: PortraitModel;
    members: ProfileGroupMemberModel[];
}

export interface ProfileGroupResolve {
    _id: string;
    name: string;
    group: ProfileGroupModel;
}

export interface LoaderProfileGroupsResponse {
    _id: ObjectId;
    name: string;
    portrait: PortraitModel;
}



export interface GroupListMembersModel {
    _id: ObjectId | string;
    relationId: ObjectId | string;
    name: string;
    portrait: PortraitModel;
}

export interface ProfileGroupsResolve {
    name: string;
    canEditGroups: boolean;
}