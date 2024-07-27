import { IProvider, InjectorContext } from 'providerjs';
import { Connection, ConnectionResult, DataAccess } from '../dataaccess';

export class DataAccessProvider implements IProvider {

    private key: Symbol;
    private connection?: ConnectionResult;

    public constructor(
        private alias: string,
        private access: any[]
    ) {
        this.key = Symbol();
    }
    
    public identify(identifier: any): boolean {
        if (typeof identifier != 'function') {
            return false;
        }
        const access = Reflect.getOwnMetadata(this.key, identifier);
        if (access) {
            return true;
        }
        else {
            return !!this.access
                .find(a => a === identifier);
        }
    }
    
    public get(context: InjectorContext): any {
        const access = Reflect.getOwnMetadata(this.key, context.identifier);
        if (access) {
            return access;
        }
        else {
            const access = this.access
                .find(a => a === context.identifier);
            const instance = <DataAccess<any>>context.create(access, undefined, context.extraData);
            Reflect.defineMetadata(this.key, instance, context.identifier);
            if (!this.connection) {
                const connection = <Connection>context.get(Connection, true);
                this.connection = connection.getConnection(this.alias);
            }
            instance.initialize(this.connection!)
            return instance;
        }
    }
}