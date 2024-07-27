import { Injector, StaticProvider } from 'providerjs';
import { Connection } from './connection';
import { Db } from 'mongodb';
import { DataAccess } from './dataaccess';

export const Access = (): PropertyDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        if (typeof propertyKey != 'string') {
            return;
        }
        let dataaccess = <string[] | undefined>Reflect.getOwnMetadata('dataaccess', target)
        if (!dataaccess) {
            dataaccess = [];
            Reflect.defineMetadata('dataaccess', dataaccess, target);
        }
        dataaccess.push(propertyKey);
    }
}

export class Database {

    protected db: Db;
    private access: { [prop: string]: DataAccess<any> }
    
    public constructor(
        protected alias: string,
        protected connection: Connection,
        protected injector: Injector
    ) {
        this.access = {};
        this.prepareDataAccess();
    }

    protected async getDatabase(): Promise<Db> {
        const connectionResult = await this.connection.getConnection(this.alias);
        if (!connectionResult.cb.database) {
            throw 'Final connectionString must have the database name! alias: ' + this.alias;
        }
        return connectionResult.client.db(connectionResult.cb.database);
    }

    private prepareDataAccess(): void {
        const dataaccess = <string[] | undefined>Reflect.getOwnMetadata('dataaccess', (<any>this).__proto__);

        if (dataaccess && dataaccess.length > 0) {
            for (let prop of dataaccess) {
                Object.defineProperty(this, prop, {
                    get: this.getDataAccess.bind(this, prop)
                });
            }
        }
    }

    private async checkDb(): Promise<Db> {
        if (!this.db) {
            this.db = await this.getDatabase();
        }
        return this.db;
    }

    private async getDataAccess(prop: string): Promise<DataAccess<any>> {
        if (!this.access[prop]) {
            const type = Reflect.getMetadata('design:type', this, prop);
            const provider = new StaticProvider(type);
            const instance = <DataAccess<any>>this.injector.get(type, true, [provider]);
            const db = await this.checkDb();
            await instance.initialize(db);
            this.access[prop] = instance;
        }
        return this.access[prop]!;
    }
}