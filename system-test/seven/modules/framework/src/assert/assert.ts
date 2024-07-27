import { ObjectId } from 'mongodb';
import { SevenError } from '../error/seven.error'
import { DatabaseAssert } from './database.assert';

export class Assert {

    private static innerDatabase: DatabaseAssert | undefined;

    public static test(test: () => boolean, error: any): void {
        if (!test()) {
            throw new SevenError(error);
        }
    }

    public static mustTrue(test: boolean, error: any): void {
        if (!test) {
            throw new SevenError(error);
        }
    }

    public static mustFalse(test: boolean, error: any): void {
        if (test) {
            throw new SevenError(error);
        }
    }

    public static mustNull(test: any, error: any): asserts test {
        if (!(test === undefined || test === null)) {
            throw new SevenError(error);
        }
    }

    public static mustNotNull(test: any, error: any): asserts test {
        if (test === undefined || test === null) {
            throw new SevenError(error);
        }
    }

    public static mustNotEqual<T>(obj0: T, obj1: T, error: any): void {
        if (obj0 === obj1) {
            throw new SevenError(error);
        }
    }

    public static validObjectId(id: any, error: any): void {
        if (!ObjectId.isValid(id)) {
            throw new SevenError(error);
        }
    }

    public static get database(): DatabaseAssert {
        if (!Assert.innerDatabase) {
            Assert.innerDatabase = new DatabaseAssert();
        }
        return Assert.innerDatabase;
    }
}