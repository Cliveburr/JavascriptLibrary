import { ObjectId } from '@seven/framework';
import { RelationState, RelationType } from '../entity';
import { PortraitModel } from './portrait.model';

export interface ProfileRelationsResolve {
    name: string;
    canEditRelations: boolean;
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
    _id: ObjectId | string;
    name: string;
}

export interface LoaderProfileRelationsResponse {
    type: RelationType;
    state: RelationState;
    realProfileId: ObjectId;
    name: string;
    email: string;
    portrait: PortraitModel;
}

export interface LoaderRelationSelect {
    _id: ObjectId;
    name: string;
    portrait: PortraitModel;
}