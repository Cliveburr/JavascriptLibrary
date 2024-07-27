import { EntityBase, ObjectId } from '@seven/framework';
import { PortraitModel } from '../model';

export enum ProfileType {
    Private = 0,
    Legal = 1
}

export interface LegalData {
    ownerId: ObjectId;
}

export interface PrivateData {
}

export interface ProfileEntity extends EntityBase {
    type: ProfileType;
    nickName: string;
    name: string;
    email: string;
    legal?: LegalData;
    private?: PrivateData;
    portrait?: PortraitModel;
}