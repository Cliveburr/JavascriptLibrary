import { EntityBase, ObjectId } from '@seven/framework';

export interface SaleEntity extends EntityBase {
    appInstanceId: ObjectId;
    total: number;
    alias: string;
    createdDatetime: Date;
}
