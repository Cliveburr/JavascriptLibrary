import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotifyService } from '../notify.service';
import { TenError } from '../../ten.error';
import { SessionService } from '../session.service';
import { OneProcessStack } from './processstack';
import { IMessageStock, IMessage } from './message';

export interface IPath {
    receiver?: any;
    call: <T>(method: string, ...args: any[]) => Promise<T>;
}

@Injectable()
export class WebSocketService {

    private static TIMEOUT = 360000;
    private static RECONNECT = 1000;
    private ws?: WebSocket;
    private paths: { [path: string]: IPath };
    private msgsIndex: number;
    private msgsToSend: OneProcessStack<IMessageStock>;
    private msgsWaiting: OneProcessStack<IMessageStock>;
    private msgsToProcess: OneProcessStack<IMessage>;
    private address?: string;
    private isForReconnecting: boolean;
    private status: 'closed' | 'opening' | 'open';
    public handleOnReconnectEvent: Subject<void>;
    private nextProfile?: string;
    private nextApp?: string;

    private ws_onopenBind: any;
    private ws_onerrorBind: any;
    private ws_oncloseBind: any;
    private ws_onmessageBind: any;

    public constructor(
        public router: Router,
        private notifyService: NotifyService,
        private sessionService: SessionService
    ) {
        this.paths = {};
        this.msgsIndex = 1;
        this.isForReconnecting = false;
        this.status = 'closed';
        this.handleOnReconnectEvent = new Subject();
        this.ws_onopenBind = this.ws_onopen.bind(this);
        this.ws_onerrorBind = this.ws_onerror.bind(this);
        this.ws_oncloseBind = this.ws_onclose.bind(this);
        this.ws_onmessageBind = this.ws_onmessage.bind(this);
        this.msgsToSend = new OneProcessStack<IMessageStock>(this.sendMsg.bind(this));
        this.msgsWaiting = new OneProcessStack<IMessageStock>(this.waitingMsg.bind(this), 1000);
        this.msgsToProcess = new OneProcessStack<IMessage>(this.processMsg.bind(this));
        this.address = window.document.location.host + '/api';
    }

    private tryConnect(): void {
        if (this.msgsToSend.stack.length > 0 || this.msgsWaiting.stack.length > 0) {
            const fullAddress = 'ws://' + this.address;
            try {
                this.status = 'opening';
                this.ws = new WebSocket(fullAddress);
                this.ws.addEventListener('open', this.ws_onopenBind);
                this.ws.addEventListener('error', this.ws_onerrorBind);
            } 
            catch (err) {
                this.status = 'closed';
                setTimeout(this.tryConnect.bind(this), WebSocketService.RECONNECT);
            }
        }
    }

    private ws_onopen(): void {
        if (!this.ws) {
            throw 'Invalid WebSocket state!';
        }

        this.status = 'open';
        this.ws.removeEventListener('open', this.ws_onopenBind);
        this.ws.addEventListener('close', this.ws_oncloseBind);
        this.ws.addEventListener('message', this.ws_onmessageBind);

        if (this.isForReconnecting) {
            this.handleOnReconnectEvent.next();
        }
        else {
            this.isForReconnecting = true;
        }
        this.msgsToSend.checkForStart();
    }

    private ws_onerror(event: Event): void {
        this.msgsToSend.stop();
        if (this.ws) {
            this.ws.removeEventListener('open', this.ws_onopenBind);
            this.ws.removeEventListener('error', this.ws_onerrorBind);
            this.ws.removeEventListener('close', this.ws_oncloseBind);
            this.ws.removeEventListener('message', this.ws_onmessageBind);
            delete this.ws;
        }
        this.status = 'closed';
        setTimeout(this.tryConnect.bind(this), WebSocketService.RECONNECT);
    }

    private ws_onclose(event: CloseEvent): void {
        this.ws_onerror(event);
    }

    private ws_onmessage(event: MessageEvent): void {
        const msg: any = JSON.parse(event.data);
        if (!msg.path || !msg.id) {
            console.warn('Invalid WebSocket message received: ', msg);
        }
        this.msgsToProcess.push(<IMessage>msg);
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
        if (Date.now() - msg.timeSent > WebSocketService.TIMEOUT) {
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
                const path = this.getPath(msg.path);
                const method = msg.method || 'undefined';
            
                if (!path.receiver[method]) {
                    throw `Invalid method: "${method}" on path: "${msg.path}"!`;
                }

                const returnData = path.receiver[method].apply(path.receiver, msg.args);
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
                const stock = stocks[0];
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

    public openPath(path: string, receiver?: any): IPath {
        if (this.paths[path]) {
            throw `Path '${path}' is already opened!`;
        }

        this.paths[path] = {
            receiver: receiver,
            call: this.call.bind(this, path)
        };

        return this.paths[path];
    }

    public closePath(path: string): void {
        if (!this.paths[path]) {
            throw `Path '${path}' is not open!`;
        }

        // @ts-expect-error
        delete this.paths[path].call;
        delete this.paths[path].receiver;
        delete this.paths[path];
    }

    private getPath(path: string): IPath {
        const lowPath = path.toLowerCase();
        if (this.paths[lowPath]) {
            return this.paths[lowPath];
        }
        else {
            throw `Class for path '${path}' not found!`;
        }
    }

    private stockExecute(stock: IMessageStock, data?: any): void {
        if (stock.execute) {
            try {
                stock.execute(data);
            }
            catch (error) {
                //this.handleError(error);
                // one call from server has error
                // error must be back to server
            }
        }
    }

    private stockReject(stock: IMessageStock, error?: any): void {
        //let isHandled = false;

        if (error) {
            if (TenError.isTenError(error)) {
                this.notifyService.addNotify('danger', error.message);
                if (error.redirect) {
                    switch (error.redirect) {
                        case '@home':
                            this.router.navigateByUrl('/' + this.sessionService.profile!.nickName, { replaceUrl: true });
                            return;
                        default:
                            this.router.navigateByUrl(error.redirect);
                            return;
                    }
                }
                else {
                    //return false;
                }
            }
            else if (error.name === 'MongoError') {
                this.notifyService.addNotify('danger', `MongoError code(${error.code}) codeName(${error.codeName})`);
                //return false;
            }
            else {
                this.notifyService.addNotify('danger', error.toString());
                //return false;
            }
        }
        else {
            this.notifyService.addNotify('danger', 'Unknown error happen!');
            //return false;
        }
        //return true;

        //if (!isHandled) {
            if (stock.reject) {
                try {
                    stock.reject(error);
                }
                catch (err) {
                    console.error('WebSocket error call not catch!');
                    console.error(error);
                }
            }
            else {
                console.error('WebSocket error call not catch!');
                console.error(error);
            }
        //}
    }

    public setNextProfileApp(nextProfile: string, nextApp: string): void {
        this.nextProfile = nextProfile;
        this.nextApp = nextApp;
    }

    public call(path: string, method: string, ...args: any[]): Promise<any> {
        return new Promise((e, r) => {
            const paths: Array<string | undefined> = [];
            if (this.nextProfile || this.nextApp) {
                paths.push(this.nextProfile, this.nextApp);
                delete this.nextProfile;
                delete this.nextApp;
            }
            else {
                paths.push(...window.location.pathname
                    .split('/')
                    .filter(p => p.length > 0));
            }
            const msg: IMessage = {
                path,
                id: this.msgsIndex++,
                method,
                args,
                profile: paths[0],
                app: paths[1]
            };
            const msgStock: IMessageStock = {
                timeSent: Date.now(),
                msg,
                execute: e,
                reject: r
            };
            this.msgsToSend.push(msgStock);
            if (this.status == 'closed') {
                this.tryConnect();
            }
        });
    }
}
