
module Sow {
    export class System {
        private static _instance: System = new System();
        public static get instance(): System { return System._instance; }

        private _msgs: IMessage[] = [];
        private _msgsClock: boolean = false;
        private _set: (cb: Function) => void;
        private _roots: { [mid: string]: IAddress };
        private _ihnd: number;

        constructor() {
            if (System._instance)
                return null;

            this._ihnd = 0;
            this._roots = {};
            this._set = typeof (setImmediate) === 'undefined' ? (cb) => setTimeout(cb, 0) : (cb) => setImmediate(cb);
            System._instance = this;
        }

        public getHandler(): number {
            let tr = this._ihnd;
            this._ihnd++;
            return tr;
        }

        public addAddress(address: IAddAddress): void {
            let ta = address.mid.split('.');
            let to = this._roots;
            let pa = null;

            for (let i = 0, a: string; a = ta[i]; i++) {
                let ad = to[a];

                if (!ad) {
                    let na: IAddress = {
                        mid: a,
                        help: i == ta.length - 1 ? address.help : '',
                        parent: pa,
                        childs: {},
                        handlers: {},
                        subs: []
                    };
                    to[a] = ad = na;
                }

                pa = ad;
                to = ad.childs;
            }
        }

        public subscribe(address: string, cb: Function, handler: number): void {
            let a = this.findAddress(address);

            if (handler) {
                a.handlers[handler] = cb;
            }
            else {
                a.subs.push(cb);
            }
        }

        private findAddress(address: string): IAddress {
            let ta = address.split('.');
            let to = this._roots;
            let tr: IAddress = null;

            for (let i = 0, a: string; a = ta[i]; i++) {
                let ad = to[a];

                if (!ad)
                    throw 'Message address not exists!';

                tr = ad;
                to = ad.childs;
            }

            return tr;
        }

        public send(msg: IMessage): void {
            this._msgs.push(msg);
            this.checkMsgClock();
        }

        private checkMsgClock(): void {
            if (!this._msgsClock && this._msgs.length > 0) {
                this._msgsClock = true;
                this._set(() => {
                    this._msgsClock = false;
                    this.processMsg();
                })
            }
        }

        private processMsg(): void {
            let msg = this._msgs.shift();
            let ta = msg.address.split('.');
            let to = this._roots;

            for (let i = 0, a: string; a = ta[i]; i++) {
                let ad = to[a];

                if (!ad)
                    throw `Message address not found! '${msg.address}'`;

                if (ad.subs.length > 0) {
                    for (let i = 0, s: Function; s = ad.subs[i]; i++) {
                        s(msg);
                    }
                }

                if (i == ta.length - 1 && msg.handler) {
                    if (!ad.handlers[msg.handler])
                        throw `Message handler '${msg.handler}' not found for address '${msg.address}'!`;

                    ad.handlers[msg.handler](msg);
                }

                to = ad.childs;
            }

            this.checkMsgClock();
        }
    }

    export class HandlerBase {
        protected _hnd: number;
        public get hnd(): number { return this._hnd; }

        constructor() {
            this._hnd = System.instance.getHandler();
        }
    }

    export function sendA(msg: IMessage): void {
        System.instance.send(msg);
    }

    export function send<T>(address: string, data?: T, handler?: number): void {
        System.instance.send({
            address: address,
            data: data,
            handler: handler
        });
    }

    export function addAddress(address: IAddAddress): void {
        System.instance.addAddress(address);
    }

    export function addAddresses(address: IAddAddress[]): void {
        for (let i = 0, a: IAddAddress; a = address[i]; i++) {
            System.instance.addAddress(a);
        }
    }

    export function subscribe(mid: string, cb: Function): void {
        System.instance.subscribe(mid, cb, null);
    }

    export function subscribeH(mid: string, cb: Function, handler: number): void {
        System.instance.subscribe(mid, cb, handler);
    }

    Sow.addAddresses([
        { mid: 'sow', help: 'Root of the system' },
        { mid: 'sow.interactive', help: 'Happen when the document.readyState enter on interactive' },
        { mid: 'sow.complete', help: 'Happen when the document.readyState enter on complete' },
    ]);
    
    document.onreadystatechange = function () {
        if (document.readyState == "interactive") {
            send('sow.interactive');
        }
        else if (document.readyState == "complete") {
            send('sow.complete');
        }
    }
}