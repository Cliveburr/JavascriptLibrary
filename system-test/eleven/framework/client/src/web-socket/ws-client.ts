// import { IMessage, IMessageStock } from "./models";
// import { ProcessStack } from "./process-stack";

export class WsClient {

    private static TIMEOUT = 10000;
    private static RECONNECT = 1000;
    // private ws?: WebSocket;
    // private paths: { [path: string]: any };
    // private msgsIndex: number;
    // private msgsToSend: ProcessStack<IMessageStock>;
    // private msgsWaiting: ProcessStack<IMessageStock>;
    // private msgsToProcess: ProcessStack<IMessage>;
    // private address?: string;
    // private isForReconnecting: boolean;

    // private ws_onopenBind: any;
    // private ws_onerrorBind: any;
    // private ws_oncloseBind: any;
    // private ws_onmessageBind: any;

    // public constructor(
    //     private handleError: (error?: any) => boolean,
    //     private handleOnReconnect?: () => void
    // ) {
    //     this.paths = {};
    //     this.msgsIndex = 1;
    //     this.isForReconnecting = false;
    //     this.ws_onopenBind = this.ws_onopen.bind(this);
    //     this.ws_onerrorBind = this.ws_onerror.bind(this);
    //     this.ws_oncloseBind = this.ws_onclose.bind(this);
    //     this.ws_onmessageBind = this.ws_onmessage.bind(this);
    //     this.msgsToSend = new ProcessStack<IMessageStock>(this.sendMsg.bind(this));
    //     this.msgsWaiting = new ProcessStack<IMessageStock>(this.waitingMsg.bind(this), 1000);
    //     this.msgsToProcess = new ProcessStack<IMessage>(this.processMsg.bind(this));
    // }

    // public connect(address?: string): void {
    //     this.address = address;
    //     this.tryConnect();
    // }

    // private tryConnect(): void {
    //     const fullAddress = 'ws://' + (this.address || window.document.location.host);

    //     try {
    //         if (window.ws) {
    //             const server = window.ws.wsClient;
    //             server.removeEventListener('open', window.ws.onopenBind);
    //             server.removeEventListener('error', window.ws.onerrorBind);
    //             server.removeEventListener('close', window.ws.oncloseBind);
    //             server.removeEventListener('message', window.ws.onmessageBind);
    //             delete window.ws;
    //             this.ws = server;
    //             this.msgsToSend.checkForStart();
    //         }
    //         else {
    //             this.ws = new WebSocket(fullAddress);
    //         }
    //         this.ws.addEventListener('open', this.ws_onopenBind);
    //         this.ws.addEventListener('error', this.ws_onerrorBind);
    //         this.ws.addEventListener('close', this.ws_oncloseBind);
    //         this.ws.addEventListener('message', this.ws_onmessageBind);
    //         window.ws = {
    //             wsClient: this.ws,
    //             onopenBind: this.ws_onopenBind,
    //             onerrorBind: this.ws_onerrorBind,
    //             oncloseBind: this.ws_oncloseBind,
    //             onmessageBind: this.ws_onmessageBind
    //         }
    //     } 
    //     catch (err) {
    //         setTimeout(this.tryConnect.bind(this), WsClient.RECONNECT);
    //     }
    // }

    // private ws_onopen(): void {
    //     if (this.ws) {
    //         this.ws.removeEventListener('open', this.ws_onopenBind);
    //         this.ws.addEventListener('close', this.ws_oncloseBind);
    //         this.ws.addEventListener('message', this.ws_onmessageBind);

    //         if (this.isForReconnecting) {
    //             if (this.handleOnReconnect) {
    //                 this.handleOnReconnect();
    //             }
    //         }
    //         else {
    //             this.isForReconnecting = true;
    //         }
    //     }
    //     this.msgsToSend.checkForStart();
    // }

    // private ws_onerror(event: Event): void {
    //     this.msgsToSend.stop();
    //     if (this.ws) {
    //         this.ws.removeEventListener('open', this.ws_onopenBind);
    //         this.ws.removeEventListener('error', this.ws_onerrorBind);
    //         this.ws.removeEventListener('close', this.ws_oncloseBind);
    //         this.ws.removeEventListener('message', this.ws_onmessageBind);
    //     }
    //     delete window.ws;
    //     setTimeout(this.tryConnect.bind(this), WsClient.RECONNECT);
    // }

    // private ws_onclose(event: CloseEvent): void {
    //     this.ws_onerror(event);
    // }

    // private ws_onmessage(event: MessageEvent): void {
    //     const msgValidate: any = JSON.parse(event.data);
    //     if (!msgValidate.path || !msgValidate.id) {
    //         console.warn('Invalid WebSocket message received: ', msgValidate);
    //     }
    //     const msg = msgValidate as IMessage;
    //     this.msgsToProcess.push(msg);
    // }

    // private sendMsg(msg: IMessageStock): boolean {
    //     if (this.ws && this.ws.readyState == this.ws.OPEN) {
    //         try {
    //             this.ws.send(JSON.stringify(msg.msg));
    //             if (msg.timeSent > 0) {
    //                 this.msgsWaiting.push(msg);
    //             }
    //         } catch (error) {
    //             this.stockReject(msg, error);
    //         }
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    // private waitingMsg(msg: IMessageStock): boolean {
    //     if (Date.now() - msg.timeSent > WsClient.TIMEOUT) {
    //         this.stockReject(msg, 'TIMEOUT');
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    // private processMsg(msg: IMessage): boolean {
    //     if (msg.method) {
    //         const returnMsg: IMessage = {
    //             path: msg.path,
    //             id: msg.id
    //         };
    //         const msgStock: IMessageStock = {
    //             timeSent: 0,
    //             msg: returnMsg
    //         };

    //         try {
    //             const path = this.getPath(msg.path);
    //             const method = msg.method || 'undefined';
            
    //             if (!path[method]) {
    //                 throw `Invalid method: "${method}" on path: "${msg.path}"!`;
    //             }

    //             const returnData = path[method].apply(path, msg.args);
    //             Promise.resolve(returnData)
    //                 .then(value => {
    //                     returnMsg.return = value;
    //                     this.msgsToSend.push(msgStock);
    //                 })
    //                 .catch(reason => {
    //                     returnMsg.error = reason;
    //                     this.msgsToSend.push(msgStock);
    //                 });
    //         }
    //         catch (error) {
    //             returnMsg.error = error;
    //             this.msgsToSend.push(msgStock);
    //         }
    //     }
    //     else {
    //         const stocks = this.msgsWaiting.stack.filter(s => s.msg.id == msg.id);
    //         if (stocks && stocks.length > 0) {
    //             const stock = stocks[0]!;
    //             const stockIndex = this.msgsWaiting.stack.indexOf(stock);
    //             this.msgsWaiting.stack.splice(stockIndex, 1);
    //             if (msg.error) {
    //                 this.stockReject(stock, msg.error);
    //             }
    //             else {
    //                 this.stockExecute(stock, msg.return);
    //             }
    //             }
    //         }
    //     return true;
    // }

    // public openPath<T>(path: string, cls: any): T {
    //     if (this.paths[path]) {
    //         throw `Path '${path}' is already opened!`;
    //     }
    //     return this.paths[path] = new cls(this.call.bind(this, path));
    // }

    // public closePath(path: string): void {
    //     if (!this.paths[path]) {
    //         throw `Path '${path}' is not open!`;
    //     }
    //     delete this.paths[path];
    // }

    // private getPath(path: string): any {
    //     if (this.paths[path]) {
    //         return this.paths[path];
    //     }
    //     else {
    //         throw `Class for path '${path}' not found!`;
    //     }
    // }

    // private stockExecute(stock: IMessageStock, data?: any): void {
    //     if (stock.execute) {
    //         try {
    //             stock.execute(data);
    //         }
    //         catch (error) {
    //             //this.handleError(error);    
    //         }
    //     }
    // }

    // private stockReject(stock: IMessageStock, error?: any): void {
    //     let isHandled = false;
    //     // if (typeof this.handleError != 'undefined') {
    //     //     isHandled = this.handleError(error);
    //     // }
        
    //     if (!isHandled) {
    //         if (stock.reject) {
    //             try {
    //                 stock.reject(error);
    //             }
    //             catch (err) {
    //                 console.error('WebSocket error call not catch!');
    //                 console.error(error);
    //             }
    //         }
    //         else {
    //             console.error('WebSocket error call not catch!');
    //             console.error(error);
    //         }
    //     }
    // }

    // private call(path: string, method: string, ...args: any[]): Promise<any> {
    //     return new Promise((e, r) => {
    //         const msg: IMessage = {
    //             path,
    //             id: this.msgsIndex++,
    //             method,
    //             args
    //         };
    //         const msgStock: IMessageStock = {
    //             timeSent: Date.now(),
    //             msg,
    //             execute: e,
    //             reject: r
    //         };
    //         this.msgsToSend.push(msgStock);
    //     });
    // }
}