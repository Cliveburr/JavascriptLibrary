import { EntityBase, ObjectId } from '@seven/framework';
import { SaleStatus } from './enums';

export interface BatchEntity extends EntityBase {
    startDatetime: Date;
    endDatetime: string;
    alias: string;
    commissionsIds: ObjectId[];
    status: SaleStatus;
}