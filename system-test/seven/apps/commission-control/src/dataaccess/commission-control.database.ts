import { Injectable, Injector } from 'providerjs';
import { Database, Connection, Access } from '@seven/framework';
import { SaleDataAccess, CommissionDataAccess, CommissionedDataAccess, BatchDataAccess } from '.';

@Injectable()
export class CommissionControlDatabase extends Database {

    public constructor(
        connection: Connection,
        injector: Injector
    ) {
        super('commission-control', connection, injector)
    }
    
    @Access() public sale: SaleDataAccess;
    @Access() public batch: BatchDataAccess;
    @Access() public commission: CommissionDataAccess;
    @Access() public commissioned: CommissionedDataAccess;
}