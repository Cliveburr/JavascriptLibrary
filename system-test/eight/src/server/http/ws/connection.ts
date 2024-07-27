import * as http from 'http';
import * as ws from 'ws';
import { DiagnosticLevel } from '../models';
import { IMessage, IMessageStock, ISession } from './models';
import { ProcessStack } from './process-stack';
import { WsServer } from './server';

export class WsConnection {

    private static TIMEOUT = 30000;
    private msgsIndex: number;
    private msgsToSend: ProcessStack<IMessageStock>;
    private msgsWaiting: ProcessStack<IMessageStock>;
    private msgsToProcess: ProcessStack<IMessage>;
    private session: ISession;

    private onmessageBind: (...args: any[]) => void;
    private oncloseBind: (...args: any[]) => void;
    private onerrorBind: (...args: any[]) => void;

    public constructor(
        public guid: string,
        public ws: ws,
        public request: http.IncomingMessage,
        private server: WsServer
    ) {
        this.msgsIndex = 1;
        this.msgsToSend = new ProcessStack<IMessageStock>(this.sendMsg.bind(this));
        this.msgsWaiting = new ProcessStack<IMessageStock>(this.waitingMsg.bind(this), 1000);
        this.msgsToProcess = new ProcessStack<IMessage>(this.processMsg.bind(this));
        this.session = this.generateSession(request);
        this.onmessageBind = this.ws_onmessage.bind(this);
        this.oncloseBind = this.ws_onclose.bind(this);
        this.onerrorBind = this.ws_onerror.bind(this);
        this.setBinds();
    }

    private setBinds(): void {
        this.ws.addListener('message', this.onmessageBind);
        this.ws.addListener('close', this.oncloseBind);
        this.ws.addListener('error', this.onerrorBind);
    }

    public unBinds(): void {
        this.ws.removeListener('message', this.onmessageBind);
        this.ws.removeListener('close', this.oncloseBind);
        this.ws.removeListener('error', this.onerrorBind);
        for (const clean of ['ws', 'request', 'server']) {
            delete (<any>this)[clean];
        }
    }

    private generateSession(request: http.IncomingMessage): ISession {
        return {
            guid: this.guid,
            request,
            log: this.server.log.bind(this.server)
        };
    }

    private ws_onmessage(data: ws.Data): void {
        try {
            const msgValidate: any = JSON.parse(data as string);
            if (!msgValidate.path || !msgValidate.id) {
                throw 'Invalid WebSocket message received: ' + data.toString();
            }
            const msg = msgValidate as IMessage;
            this.msgsToProcess.push(msg);
        }
        catch (error) {
            this.server.log(error, DiagnosticLevel.Error);
        }
    }

    private ws_onclose(): void {
        this.ws.removeListener('message', this.onmessageBind);
        this.ws.removeListener('close', this.oncloseBind);
        this.ws.removeListener('error', this.onerrorBind);
        this.ws.close();
        this.server.disconnection(this.guid);
        this.server.data.pathProvider.clear(this.guid);
        for (const clean of ['ws', 'request', 'server']) {
            delete (<any>this)[clean];
        }
    }

    private ws_onerror(error: Error): void {
        this.server.log(error, DiagnosticLevel.Error);
    }

    private sendMsg(msg: IMessageStock): boolean {
        if (this.ws && this.ws.readyState == this.ws.OPEN) {
            try {
                this.ws.send(JSON.stringify(msg.msg));
                if (msg.timeSent > 0) {
                    this.msgsWaiting.push(msg);
                }
            } catch (error) {
                this.stockReject(msg, error);
            }
            return true;
        }
        else {
            return false;
        }
    }

    private waitingMsg(msg: IMessageStock): boolean {
        if (Date.now() - msg.timeSent > WsConnection.TIMEOUT) {
            this.stockReject(msg, 'TIMEOUT');
            return true;
        }
        else {
            return false;
        }
    }

    private processMsg(msg: IMessage): boolean {
        if (msg.method) {
            const returnMsg: IMessage = {
                path: msg.path,
                id: msg.id
            };
            const msgStock: IMessageStock = {
                timeSent: 0,
                msg: returnMsg
            };

            try {
                let path = this.server.data.pathProvider.getPath(this.guid, msg.path);
                if (!path) {
                    path = this.server.data.pathProvider.instancePath({
                        guid: this.guid,
                        path: msg.path,
                        session: this.session,
                        call: this.call.bind(this, msg.path),
                        callAll: this.callAll.bind(this, msg.path)
                    });
                }
                const method = msg.method || 'undefined';
            
                if (!path[method]) {
                    throw `Invalid method: "${method}" on path: "${msg.path}"!`;
                }

                const returnData = path[method].apply(path, msg.args);
                Promise.resolve(returnData)
                    .then(value => {
                        returnMsg.return = value;
                        this.msgsToSend.push(msgStock);
                    })
                    .catch(reason => {
                        returnMsg.error = reason;
                        this.msgsToSend.push(msgStock);
                    });
            }
            catch (error) {
                returnMsg.error = error;
                this.msgsToSend.push(msgStock);
            }
        }
        else {
            const stocks = this.msgsWaiting.stack.filter(s => s.msg.id == msg.id);
            if (stocks && stocks.length > 0) {
                const stock = stocks[0]!;
                const stockIndex = this.msgsWaiting.stack.indexOf(stock);
                this.msgsWaiting.stack.splice(stockIndex, 1);
                if (msg.error) {
                    this.stockReject(stock, msg.error);
                }
                else {
                    this.stockExecute(stock, msg.return);
                }
            }
        }
        return true;
    }

    private stockExecute(stock: IMessageStock, data?: any): void {
        if (stock.execute) {
            try {
                stock.execute(data);
            }
            catch (error) {
                this.server.log(error, DiagnosticLevel.Error);    
            }
        }
    }

    private stockReject(stock: IMessageStock, error?: any): void {
        if (stock.reject) {
            try {
                stock.reject(error);
            }
            catch {
                this.server.log(error, DiagnosticLevel.Error);    
            }
        }
        else {
            this.server.log(error, DiagnosticLevel.Error);
        }
    }

    public call(path: string, method: string, ...args: any[]): Promise<any> {
        return new Promise((e, r) => {
            const msg: IMessage = {
                path,
                id: this.msgsIndex++,
                method,
                args
            }
            const msgStock: IMessageStock = {
                timeSent: Date.now(),
                msg,
                execute: e,
                reject: r
            }
            this.msgsToSend.push(msgStock);
        });
    }

    private callAll(path: string, method: string, ...args: any[]): Promise<any> {
        const returns: Promise<any>[] = [];
        for (let client of this.server.hosts.toList()) {
            returns.push(client.call(path, method, ...args));
        }
        return Promise.all(returns);
    }
}
