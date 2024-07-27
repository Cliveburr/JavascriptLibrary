import * as http from 'http';
import * as ws from 'ws';
import { Injectable, Injector, Identify, Required } from 'providerjs';
import { IConfigureServices, GuidDictonary, DIAGNOSTIC_INSTANCE, IDiagnostic, DiagnosticLevel } from "webhost";
import { Host } from './host';
import { WS_PATH_LOADER_PROVIDER, IPathLoader } from './path.loader';
// import { IPathData } from '../path/path.data';

// export interface IPathStored {
//     data: IPathData;
//     target: Object;
//     clientMethods?: string[];
// }

@Injectable()
export class WebSocketService {

    public hosts: GuidDictonary<Host>;
    private server?: ws.Server;
    private paths: { [key: string]: Object };
    private handleConnectionBind: (...args: any[]) => void;
    private handleErrorBind: (...args: any[]) => void;

    public constructor(
        @Required() @Identify(WS_PATH_LOADER_PROVIDER) private pathLoader: IPathLoader,
        @Required() @Identify(DIAGNOSTIC_INSTANCE) public diagnostic: IDiagnostic,
        public injector: Injector
    ) {
        this.hosts = new GuidDictonary<Host>();
        this.paths = {};
        this.handleConnectionBind = this.connection.bind(this);
        this.handleErrorBind = this.error.bind(this);
    }

    public configureWebSocket(services: IConfigureServices): void {
        if (global.ws) {
            this.server = global.ws.wsServer.server;
            for (const conn of global.ws.wsServer.hosts.toList()) {
                const guid = conn.guid;
                const ws = conn.ws;
                const request = conn.request;
                conn.unBinds();
                const newConn = new Host(guid, ws, request, this);
                this.hosts.set(guid, newConn);
            }
            global.ws.wsServer.unBinds();
            delete global.ws;
        }
        else {
            this.server = new ws.Server({ server: services.httpServer });
        }
        global.ws = {
            wsServer: this
        };
        this.setBinds();
    }

    private setBinds(): void {
        this.server!.on('connection', this.handleConnectionBind);
        this.server!.on('error', this.handleErrorBind);
    }

    public unBinds(): void {
        this.server!.off('connection', this.handleConnectionBind);
        this.server!.off('error', this.handleErrorBind);
    }

    private connection(webSocket: ws, request: http.IncomingMessage): void {
        const guid = this.hosts.getFreeGuid();
        const host = new Host(guid, webSocket, request, this);
        this.hosts.set(guid, host);
        this.diagnostic.log('WS Connection: ' + guid);
    }

    public disconnection(guid: string): void {
        this.hosts.remove(guid);
        this.diagnostic.log('WS Disconnection: ' + guid);
    }

    public error(error: Error): void {
        this.diagnostic.log(error, DiagnosticLevel.Error);
    }

    public getPath(path: string): Object {
        if (!this.paths[path]) {
            this.paths[path] = this.pathLoader.getPath(path);

            // const isPath = Reflect.getOwnMetadata('path:is', obj);
            // if (!isPath) {
            //     throw 'Invalid path! ' + obj.toString();
            // }

            // const pathData = <IPathData>Reflect.getOwnMetadata('path:data', obj);
            // if (path !== pathData.path) {
            //     throw 'Invalid path data for: ' + path;
            // }
            // this.paths[path] = {
            //     data: pathData,
            //     target: obj
            // };
            // if (pathData.client) {
            //     this.paths[path].clientMethods = this.extractMethods(pathData.client);
            // }
        }
        return this.paths[path]!;
    }

    // private extractMethods(target: any): string[] {
    //     const methods: string[] = [];
    //     const obj = new target();
    //     for (let method of Object.getOwnPropertyNames(obj.__proto__)) {
    //         switch (method) {
    //             case "constructor":
    //                 continue;
    //             default:
    //                 methods.push(method);
    //             }
    //     }
    //     return methods;
    // }
}
