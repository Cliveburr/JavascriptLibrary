import { Injectable, Injector } from 'providerjs';
import { Database, Connection, Access } from '@seven/framework';
import { AppPrototypeDataAccess, AppInstanceDataAccess } from '.';

@Injectable()
export class AppDatabase extends Database {

    public constructor(
        connection: Connection,
        injector: Injector
    ) {
        super('app', connection, injector)
    }
    
    @Access() public prototype: AppPrototypeDataAccess;
    @Access() public instance: AppInstanceDataAccess;
}