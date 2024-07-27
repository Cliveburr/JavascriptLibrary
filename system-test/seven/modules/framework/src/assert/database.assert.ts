import { SevenError } from '../error/seven.error'
import { UpdateWriteOpResult, InsertWriteOpResult, DeleteWriteOpResultObject, InsertOneWriteOpResult, Cursor } from 'mongodb';
import { EntityBase } from '../model';

export class DatabaseAssert {

    public updatedOne(result: UpdateWriteOpResult | undefined, error: any): void {
        if (!(result && result.matchedCount == 1)) {
            throw new SevenError(error);
        }
    }

    public updatedMany(result: UpdateWriteOpResult | undefined, count: number, error: any): void {
        if (!(result && result.matchedCount == count)) {
            throw new SevenError(error);
        }
    }

    public insertedOne(result: InsertOneWriteOpResult<EntityBase> | undefined, error: any): void {
        if (!(result && result.insertedCount == 1)) {
            throw new SevenError(error);
        }
    }

    public insertedMany(result: InsertWriteOpResult<EntityBase> | undefined, count: number, error: any): void {
        if (!(result && result.insertedCount == count)) {
            throw new SevenError(error);
        }
    }

    public replace(result: UpdateWriteOpResult | UpdateWriteOpResult[] | undefined, count: number, error: any): void {
        if (result) {
            if (Array.isArray(result)) {
                const updated = result
                    .reduce(((total, r) => total + r.matchedCount), 0)
                if (updated == count) {
                    return;
                }
            }
            else {
                if (result.matchedCount == count) {
                    return;
                }
            }
        }
        throw new SevenError(error);
    }

    public delete(result: DeleteWriteOpResultObject | DeleteWriteOpResultObject[] | undefined, count: number, error: any): void {
        if (result) {
            if (Array.isArray(result)) {
                const updated = result
                    .reduce(((total, r) => total + (r.deletedCount || 0)), 0)
                if (updated == count) {
                    return;
                }
            }
            else {
                if (result.deletedCount == count) {
                    return;
                }
            }
        }
        throw new SevenError(error);
    }
}