import { EntityBase, ObjectId } from '@seven/framework';

export enum LoginType {
    Password = 0
}

export interface LoginPassword {
    current: string;
}

export interface LoginEntity extends EntityBase {
    profilePrivateId: ObjectId;
    type: LoginType;
    password?: LoginPassword;
}
