import { PortraitModel } from "@ten/framework_interface";

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

export interface ProfileRelationsResolve {
    name: string;
    canSecurity: boolean;
    canEdit: boolean;
}

// export interface RelationOutModel {
//     _id?: string;
//     name: string;
//     email: string;
//     active: boolean;
// }

// export interface RelationOutResolve {
//     name: string;
//     relation: RelationOutModel;
// }

// export interface RelationProfileModel {
//     _id: string;
//     name: string;
// }

export interface LoaderProfileRelationsModel {
    type: RelationType;
    state: RelationState;
    realProfileId: string;
    name: string;
    email: string;
    portrait: PortraitModel;
}

// export interface LoaderRelationSelect {
//     _id: ObjectId;
//     name: string;
//     portrait: PortraitModel;
// }