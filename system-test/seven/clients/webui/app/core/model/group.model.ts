import { PortraitModel } from '../../framework';

export interface ProfileGroupsResolve {
    name: string;
    canEditGroups: boolean;
}

export enum GroupMemberType {
    IsRelation = 0,
    IsGroup = 1,
    IsSystemGroup = 2
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





export interface GroupListModel {
    _id: string;
    name: string;
    portrait: PortraitModel;
}

export interface GroupListMembersModel {
    _id: string;
    relationId: string;
    name: string;
    portrait: PortraitModel;
}