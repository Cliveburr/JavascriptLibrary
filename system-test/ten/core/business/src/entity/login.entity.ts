import { EntityBase, ObjectId } from '@ten/framework_business';

export interface LoginEntity extends EntityBase {
    profilePrivateId: ObjectId;
    type: LoginType;
    password?: LoginPassword;
}

export enum LoginType {
    Password = 0
}

export interface LoginPassword {
    current: string;
    salt: string;
}
