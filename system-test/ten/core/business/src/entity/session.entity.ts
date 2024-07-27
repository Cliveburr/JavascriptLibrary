import { EntityBase, ObjectId } from '@ten/framework_business';

export interface SessionEntity extends EntityBase {
    profilePrivateId: ObjectId;
    token: string;
    type: SessionType;
    isActive: boolean;
    createDateTime: number;
    endDateTime?: number;
    ip6: string;
}

export enum SessionType {
    WebApi = 0
}
