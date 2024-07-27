import { InputData, PortraitModel } from '../../framework';

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

export interface ProfileRelationsModel {
    name: string;
    canEditRelations: boolean;
}

export interface ProfileRelationsItem {
    _id: string;
    realProfileId: string;
    type: RelationType;
    state: RelationState;
    name: string;
}

export interface RelationOutModel {
    _id?: string;
    name: string;
    email: string;
    active: boolean;
}

export interface RelationOutResolve {
    name: string;
    relation: RelationOutModel;
}

export interface RelationProfileModel {
    _id: string;
    name: string;
}

export interface LoaderRelationSelect {
    _id: string;
    name: string;
    portrait: PortraitModel;
}