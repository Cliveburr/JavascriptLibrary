
module Sow {
    export class System {
        private _msgTypes: { [mid: string]: IMessageStore } = {};
        private _msgs: IMessage[] = [];
        private _msgsClock: boolean = false;

        public initialize(): void {
            Sow.addMsgsType([
                { mid: 'sow.interactive', help: 'Happen when the document.readyState enter on interactive' },
                { mid: 'sow.complete', help: 'Happen when the document.readyState enter on complete' },
            ]);
        }

        public addMsgType(msgType: IMessageType): void {
            if (this._msgTypes[msgType.mid])
                throw 'Message type already exists!';

            this._msgTypes[msgType.mid] = {
                mid: msgType.mid,
                subs: []
            }
        }

        public sendMsg(msg: IMessage): void {
            if (!this._msgTypes[msg.mid])
                throw 'Message type not exists!';

            this._msgs.push(msg);

            this.checkMsgClock();
        }

        public subscribe(mid: string, cb: Function): void {
            var store = this._msgTypes[mid];

            if (!store)
                throw 'Message type not exists!';

            store.subs.push(cb);
        }

        private checkMsgClock(): void {
            if (!this._msgsClock && this._msgs.length > 0) {
                this._msgsClock = true;
                setImmediate(() => {
                    this._msgsClock = false;
                    this.processMsg();
                })
            }
        }

        private processMsg(): void {
            var msg = this._msgs.shift();

            var store = this._msgTypes[msg.mid];

            if (store.subs.length > 0) {
                for (var i = 0, s: Function; s = store.subs[i]; i++) {
                    s(msg.data);
                }
            }

            this.checkMsgClock();
        }
    }

    export function sendMsg(msg: IMessage): void {
        instance.sendMsg(msg);
    }

    export function sendMsgA<T>(mid: string, data?: T): void {
        instance.sendMsg({
            mid: mid,
            data: data
        });
    }

    export function addMsgType(msgType: IMessageType): void {
        instance.addMsgType(msgType);
    }

    export function addMsgsType(msgTypes: IMessageType[]): void {
        for (var i = 0, m: IMessageType; m = msgTypes[i]; i++) {
            instance.addMsgType(m);
        }
    }

    export function subscribe(mid: string, cb: Function): void {
        instance.subscribe(mid, cb);
    }

    export var instance: System = new System();
    instance.initialize();

    document.onreadystatechange = function () {
        if (document.readyState == "interactive") {
            sendMsgA('sow.interactive');
        }
        else if (document.readyState == "complete") {
            sendMsgA('sow.complete');
        }
    }
}