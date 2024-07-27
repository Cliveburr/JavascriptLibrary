import { Injectable, Injector } from 'providerjs';
import { Database, Connection, Access } from '@seven/framework';
import { LoginDataAccess, ProfileDataAccess, SessionDataAccess, RelationDataAccess, GroupDataAccess, SecurityDataAccess, SecuritySetDataAccess } from '.';

@Injectable()
export class CoreDatabase extends Database {

    public constructor(
        connection: Connection,
        injector: Injector
    ) {
        super('core', connection, injector)
    }
    
    @Access() public profile: ProfileDataAccess;
    @Access() public login: LoginDataAccess;
    @Access() public session: SessionDataAccess;
    @Access() public relation: RelationDataAccess;
    @Access() public group: GroupDataAccess;
    @Access() public security: SecurityDataAccess;
    @Access() public securitySet: SecuritySetDataAccess;
}