import { Injectable } from 'providerjs';
import { MongoClient, MongoClientOptions } from 'mongodb';

export interface IConnectionString {
    extends?: string;
    user?: string;
    password?: string;
    url?: string;
    options?: MongoClientOptions;
    database?: string;
}

export type ConnectionStringObj = { [alias: string]: IConnectionString | undefined }

export interface ConnectionResult {
    cb: IConnectionString;
    client: MongoClient;
}

@Injectable({
    identity: 'ConnectionIdentify'
})
export class Connection {

    private clients: { [alias: string]: ConnectionResult }
    private fullcbs: { [cb: string]: MongoClient }

    public constructor(
        private cb: ConnectionStringObj
    ) {
        this.clients = {};
        this.fullcbs = {};
    }

    public getConnection(alias: string): ConnectionResult {
        if (!this.clients[alias]) {
            const thiscb = this.extractCBForAlias(alias);
            const fullcb = this.buildFullCB(thiscb);
            if (!this.fullcbs[fullcb]) {
                const client = new MongoClient(fullcb, thiscb.options);
                this.fullcbs[fullcb] = client;
            }
            this.clients[alias] = {
                cb: thiscb,
                client: this.fullcbs[fullcb]!
            };
        }
        return this.clients[alias]!;
    }

    private extractCBForAlias(alias: string): IConnectionString {
        const thiscb = this.cb[alias];
        if (thiscb) {
            if (thiscb.extends) {
                this.extendsCB(thiscb);
            }
            return thiscb;
        }
        throw 'Invalid connectionString alias! ' + alias;
    }

    private extendsCB(thiscb: IConnectionString): void {
        const extendcb = this.cb[thiscb.extends!];
        if (!extendcb) {
            throw 'Invalid extends connectionString alias! ' + thiscb.extends!;
        }
        delete thiscb.extends;
        for (let prop in extendcb) {
            if (prop == 'options') {
                if (thiscb.options) {
                    for (let opt in extendcb.options) {
                        (<any>thiscb.options)[opt] = (<any>extendcb.options)[opt]
                    }
                }
                else {
                    thiscb.options = (<any>extendcb)[prop];
                }
            }
            else {
                (<any>thiscb)[prop] = (<any>extendcb)[prop];
            }
        }
        if (thiscb.extends) {
            this.extendsCB(thiscb);
        }
    }

    private buildFullCB(thiscb: IConnectionString): string {
        if (thiscb.user && thiscb.password) {
            return `mongodb://${thiscb.user}:${thiscb.password}@${thiscb.url}`;
        }
        else {
            return `mongodb://${thiscb.url}`;
        }
    }
}