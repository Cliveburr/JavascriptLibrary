import { EntityBase, ObjectId } from '@seven/framework';
import { SaleStatus } from './enums';

// @Entity()
// export class CommissionHistoryEntity {

//     @Member()
//     public total?: number;

//     @Member()
//     public expirationDatetime?: Date;

//     @Member()
//     public status?: SaleStatus;

//     @Member()
//     public historyDatetime: Date;
// }

export interface CommissionEntity extends EntityBase {
    saleId: ObjectId;
    relationId: ObjectId;
    total: number;
    expirationDatetime: Date;
    status: SaleStatus;
    // history: CommissionHistoryEntity[];
}
