import httpServer = require('../../../../NodeHttp/Http/HttpServer');
import model = require('./Model');
var r = require('rethinkdb');

module internal {
    export function addServices(services: httpServer.IConfigureServices, database: string): void {
        services.addSingleton<Database>('database', Database)
            .on(db => {
                db.databaseName = database;
            });
        services.addPerRequest('context', Context);
    }

    export class Database {
        public host: string;
        public port: number;
        public databaseName: string;

        public conn;

        constructor() {
            this.host = 'localhost';
            this.port = 28015;
        }

        public connect(callBack: (err: string) => void): void {
            if (this.conn) {
                callBack(null);
            }
            else {
                r.connect({ host: this.host, port: this.port }, (err, conn) => {
                    if (err) {
                        this.handle_error(err);
                    }
                    else {
                        this.conn = conn;

                        conn.addListener('error', (err) => {
                            this.handle_error(err);
                        });

                        conn.addListener('close', function () {
                            this.on_close();
                        });

                        this.database(err => callBack(err));
                    }
                });
            }
        }

        private handle_error(err): void {
        }

        private on_close(): void {
            this.conn = null;
        }

        private database(callBack: (err: string) => void): void {
            r.dbList().run(this.conn, (err, list: string[]) => {
                if (err) {
                    callBack(err);
                }
                else {
                    if (list.has(this.databaseName)) {
                        this.conn.use(this.databaseName);
                        callBack(null);
                    }
                    else {
                        r.dbCreate(this.databaseName).run(this.conn, (err) => {
                            if (err) {
                                callBack(err);
                            }
                            else {
                                this.conn.use(this.databaseName);
                                callBack(null);
                            }
                        });
                    }
                }
            });
        }

        public table(name: string, callBack: (err: string, table: any) => void): void {
            this.connect(err => {
                if (err) {
                    callBack(err, null);
                }
                else {
                    r.tableList().run(this.conn, (err, list: string[]) => {
                        if (err) {
                            callBack(err, null);
                        }
                        else {
                            if (list.has(name)) {
                                callBack(null, r.table(name));
                            }
                            else {
                                r.tableCreate(name).run(this.conn, (err) => {
                                    if (err) {
                                        callBack(err, null);
                                    }
                                    else {
                                        callBack(null, r.table(name));
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    }

    export class Table<T> {
        private _table;

        constructor(
            public name: string,
            public database: Database) {
        }

        private check(callBack: (err) => void): void {
            if (this._table) {
                callBack(null);
            }
            else {
                this.database.table(this.name, (err, table) => {
                    if (err) {
                        callBack(err);
                    }
                    else {
                        this._table = table;
                        callBack(null);
                    }
                });
            }
        }

        public insert(model: T, callBack: (err, model) => void): void {
            this.check(err => {
                if (!err) {
                    this._table.insert(model).run(this.database.conn, (err, res) => {
                        if (err) {
                            callBack(err, null);
                        }
                        else {
                            callBack(null, res);
                        }
                    });
                }
            });
        }
    }

    export class Context {
        public static $inject = ['database'];

        public account: Table<model.Account>;

        constructor(
            public database: any) {
            this.account = new Table('Account', this.database);
        }
    }

}

export = internal;