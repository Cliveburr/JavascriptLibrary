import * as http from 'http';
import * as ws from 'ws';
import { GuidDictionary } from '../../helpers';
import { DiagnosticLevel } from '../models';
import { WsConnection } from './connection';
import { ServerData } from './models';

export class WsServer  {

    public hosts: GuidDictionary<WsConnection>;
    private server: ws.Server;
    private handleConnectionBind: (...args: any[]) => void;
    private handleErrorBind: (...args: any[]) => void;

    public constructor(
        public data: ServerData
    ) {
        this.hosts = new GuidDictionary<WsConnection>();
        this.server = this.prepareServer(data.host.httpServer);
        this.handleConnectionBind = this.connection.bind(this);
        this.handleErrorBind = this.error.bind(this);
        this.setBinds();
    }

    private prepareServer(httpServer: http.Server): ws.Server {
        if (global.ws) {
            const server = global.ws.wsServer.server;
            for (const conn of global.ws.wsServer.hosts.toList()) {
                const guid = conn.guid;
                const ws = conn.ws;
                const request = conn.request;
                conn.unBinds();
                const newConn = new WsConnection(guid, ws, request, this);
                this.hosts.set(guid, newConn);
            }
            global.ws.wsServer.unBinds();
            delete global.ws;
            return server;
        }
        else {
            return new ws.Server({ server: httpServer });
        }
    }

    private setBinds(): void {
        global.ws = {
            wsServer: this
        };
        this.server.on('connection', this.handleConnectionBind);
        this.server.on('error', this.handleErrorBind);
    }

    public unBinds(): void {
        this.server.off('connection', this.handleConnectionBind);
        this.server.off('error', this.handleErrorBind);
    }

    private connection(webSocket: ws, request: http.IncomingMessage): void {
        const guid = this.hosts.autoSet(<any>undefined);
        const host = new WsConnection(guid, webSocket, request, this);
        this.hosts.set(guid, host);
        this.log('WS Connection: ' + guid);
    }

    public disconnection(guid: string): void {
        this.hosts.remove(guid);
        this.log('WS Disconnection: ' + guid);
    }

    public error(error: Error): void {
        this.log(error, DiagnosticLevel.Error);
    }

    public log(text: any, level?: DiagnosticLevel): void {
        this.data.host.diagnostic.log(text, level);
    }

    public callAll(path: string, method: string, ...args: any[]): Promise<any> {
        const returns: Promise<any>[] = [];
        for (let client of this.hosts.toList()) {
            returns.push(client.call(path, method, ...args));
        }
        return Promise.all(returns);
    }
}
