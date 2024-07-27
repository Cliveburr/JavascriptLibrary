import { EntityBase, ObjectId } from '@seven/framework';

export enum SessionType {
    WebApi = 0
}

export interface SessionEntity extends EntityBase {
    profilePrivateId: ObjectId;
    token: string;
    type: SessionType;
    isActive: boolean;
    createDateTime: number;
    endDateTime?: number;
    ip6: string;
}
