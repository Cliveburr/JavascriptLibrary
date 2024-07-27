import { TenError } from '../error/ten.error'
import { InsertOneResult, UpdateResult, Document, InsertManyResult } from 'mongodb';
import { EntityBase } from '../dataaccess';

export class DatabaseAssert {

    public updatedOne(result: UpdateResult | Document | undefined, error: any): void {
        if (result) {
            // if the result is UpdateResult just check if matchedCount is one
            // if is not UpdateResult but still a Document return anyway
            // need to trow error if is different of 1
            if (typeof result.matchedCount != 'undefined') {
                if (result.matchedCount == 1) {
                    return;
                }
            }
            else {
                return;
            }
        }
        throw new TenError(error);
    }

    // public updatedMany(result: UpdateWriteOpResult | undefined, count: number, error: any): void {
    //     if (!(result && result.matchedCount == count)) {
    //         throw new TenError(error);
    //     }
    // }

    public insertedOne(result: InsertOneResult<EntityBase> | undefined, error: any): void {
        if (!(result && result?.acknowledged)) {
            throw new TenError(error);
        }
    }

    public insertedMany(result: InsertManyResult<EntityBase> | undefined, count: number, error: any): void {
        if (!(result && result.insertedCount == count)) {
            throw new TenError(error);
        }
    }

    // public replace(result: UpdateWriteOpResult | UpdateWriteOpResult[] | undefined, count: number, error: any): void {
    //     if (result) {
    //         if (Array.isArray(result)) {
    //             const updated = result
    //                 .reduce(((total, r) => total + r.matchedCount), 0)
    //             if (updated == count) {
    //                 return;
    //             }
    //         }
    //         else {
    //             if (result.matchedCount == count) {
    //                 return;
    //             }
    //         }
    //     }
    //     throw new TenError(error);
    // }

    // public delete(result: DeleteWriteOpResultObject | DeleteWriteOpResultObject[] | undefined, count: number, error: any): void {
    //     if (result) {
    //         if (Array.isArray(result)) {
    //             const updated = result
    //                 .reduce(((total, r) => total + (r.deletedCount || 0)), 0)
    //             if (updated == count) {
    //                 return;
    //             }
    //         }
    //         else {
    //             if (result.deletedCount == count) {
    //                 return;
    //             }
    //         }
    //     }
    //     throw new TenError(error);
    // }
}