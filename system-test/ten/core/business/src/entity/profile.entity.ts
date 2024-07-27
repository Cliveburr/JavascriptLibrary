import { PortraitModel } from '@ten/framework_interface';
import { EntityBase, ObjectId } from '@ten/framework_business';

export interface ProfileEntity extends EntityBase {
    type: ProfileType;
    nickName: string;
    name: string;
    email: string;
    portrait: PortraitModel;
    legal?: LegalData;
    private?: PrivateData;
}

export enum ProfileType {
    Private = 0,
    Legal = 1
}

export interface LegalData {
    ownerId: ObjectId;
}

export interface PrivateData {
}
