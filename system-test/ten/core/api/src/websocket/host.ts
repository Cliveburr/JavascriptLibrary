import * as http from 'http';
import * as ws from 'ws';
import { WebSocketService } from './websocket.service';
import { DefinedProvider, IProvider } from 'providerjs';
import { DiagnosticLevel } from 'webhost';
import { OneProcessStack } from './processstack';
import { IMessageStock, IMessage } from './message';
import { BusinessCallContext, ObjectId } from '@ten/framework_business';

export class Host {

    private static TIMEOUT = 360000;
    private msgsIndex: number;
    private msgsToSend: OneProcessStack<IMessageStock>;
    private msgsWaiting: OneProcessStack<IMessageStock>;
    private msgsToProcess: OneProcessStack<IMessage>;

    private onmessageBind: any;
    private oncloseBind: any;
    private onerrorBind: any;

    public constructor(
        public guid: string,
        public ws: ws,
        public request: http.IncomingMessage,
        private service: WebSocketService,
        public sessionProfileId?: ObjectId
    ) {
        this.msgsIndex = 1;
        this.onmessageBind = this.ws_onmessage.bind(this);
        this.oncloseBind = this.ws_onclose.bind(this);
        this.onerrorBind = this.ws_onerror.bind(this);
        this.msgsToSend = new OneProcessStack<IMessageStock>(this.sendMsg.bind(this));
        this.msgsWaiting = new OneProcessStack<IMessageStock>(this.waitingMsg.bind(this), 1000);
        this.msgsToProcess = new OneProcessStack<IMessage>(this.processMsg.bind(this));
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

    private getPath(msg: IMessage): any {
        const businessCallContext = <BusinessCallContext> {
            sessionGuid: this.guid,
            remoteAddress: this.request.socket.remoteAddress,
            locationProfile: msg.profile,
            locationApp: msg.app
        };
        Object.defineProperty(businessCallContext, 'sessionProfileId', {
            get: () => this.sessionProfileId,
            set: (v: any) => this.sessionProfileId = v
        })
        const customProviders: IProvider[] = [
            new DefinedProvider(BusinessCallContext, businessCallContext)
        ];
        return this.service.injector.get(msg.path, true, customProviders);
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
            this.service.diagnostic.log(error, DiagnosticLevel.Error);
        }
    }

    private ws_onclose(): void {
        this.ws.removeListener('message', this.onmessageBind);
        this.ws.removeListener('close', this.oncloseBind);
        this.ws.removeListener('error', this.onerrorBind);
        this.ws.close();
        this.service.disconnection(this.guid);
        // @ts-expect-error
        delete this.paths; delete this.ws; delete this.service;
    }

    private ws_onerror(error: Error): void {
        this.service.diagnostic.log(error, DiagnosticLevel.Error);
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
        if (Date.now() - msg.timeSent > Host.TIMEOUT) {
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
                const path = this.getPath(msg);
                const method = msg.method || 'undefined';
            
                if (!path[method]) {
                    throw `Invalid method: "${method}" on path: "${msg.path}"!`;
                }

                const pathType = Object.getPrototypeOf(path);
                const isBusinessEvent = Reflect.getMetadata('businessevent:is', pathType, method);
                if (isBusinessEvent !== true) {
                    throw `Not business event: "${method}" on path: "${msg.path}"!`;
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
                this.service.diagnostic.log(error, DiagnosticLevel.Error);    
            }
        }
    }

    private stockReject(stock: IMessageStock, error?: any): void {
        if (stock.reject) {
            try {
                stock.reject(error);
            }
            catch {
                this.service.diagnostic.log(error, DiagnosticLevel.Error);    
            }
        }
        else {
            this.service.diagnostic.log(error, DiagnosticLevel.Error);
        }
    }

    private call(path: string, method: string, ...args: any[]): Promise<any> {
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

    private callAll(path: string, method: string, ...args: any[]): Promise<any>[] {
        const returns: Promise<any>[] = [];
        for (let client of this.service.hosts.toList()) {
            returns.push(client.call(path, method, ...args));
        }
        return returns;
    }
}
