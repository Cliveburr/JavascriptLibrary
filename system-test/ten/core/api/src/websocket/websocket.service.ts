import * as http from 'http';
import * as ws from 'ws';
import { Injectable, Injector, Identify, Required } from 'providerjs';
import { IConfigureServices, GuidDictonary, DIAGNOSTIC, IDiagnostic, DiagnosticLevel } from "webhost";
import { Host } from './host';

@Injectable()
export class WebSocketService {

    public hosts: GuidDictonary<Host>;
    private server?: ws.Server;
    private handleConnectionBind: (...args: any[]) => void;
    private handleErrorBind: (...args: any[]) => void;

    public constructor(
        @Required() @Identify(DIAGNOSTIC) public diagnostic: IDiagnostic,
        public injector: Injector
    ) {
        this.hosts = new GuidDictonary<Host>();
        this.handleConnectionBind = this.connection.bind(this);
        this.handleErrorBind = this.error.bind(this);
    }

    public configureWebSocket(services: IConfigureServices): void {
        if ((<any>global).globalws) {
            this.server = (<any>global).globalws.server;
            for (const conn of (<any>global).globalws.hosts.toList()) {
                const guid = conn.guid;
                const ws = conn.ws;
                const request = conn.request;
                const sessionProfileId = conn.sessionProfileId;
                conn.unBinds();
                const newConn = new Host(guid, ws, request, this, sessionProfileId);
                this.hosts.set(guid, newConn);
            }
            (<any>global).globalws.unBinds();
            delete (<any>global).globalws;
        }
        else {
            this.server = new ws.Server({ server: services.httpServer });
        }
        (<any>global).globalws = this;
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
}
