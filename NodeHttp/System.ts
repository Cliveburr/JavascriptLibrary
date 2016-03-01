
module internal {
    export class Dictonary<T> {
        private _data: any = {};
        private _count: number = 0;
        get count() { return this._count; }

        public set(id: string, item: T): boolean {
            if (id in this._data) {
                return false;
            }
            else {
                this._data[id] = item;
                this._count++;
                return true;
            }
        }

        public get(id: string): T {
            if (id in this._data)
                return this._data[id];
            else
                return null;
        }

        public has(id: string): boolean {
            return id in this._data;
        }

        public remove(id: string): boolean {
            if (id in this._data) {
                delete this._data[id];
                this._count--;
                return true;
            }
            else {
                return false;
            }
        }

        public toList(): Array<T> {
            var ta = this;
            return Object.keys(this._data).map(function (e: string) {
                return ta._data[e];
            });
        }
    }

    export class AutoDictonary<T> extends Dictonary<T> {
        constructor(
            public chars: string,
            public lenght: number) {
            super();
        }

        public generateID = (): string => {
            var tr: string;
            do {
                tr = "";
                for (var i = 0; i < this.lenght; i++) {
                    tr += this.chars[Math.floor(Math.random() * this.chars.length)];
                }
            } while (this.has(tr));
            return tr;
        }

        public autoSet(item: T): string {
            var id = this.generateID();
            this.set(id, item);
            return id;
        }
    }

    export class Event<T> {
        private _events: Array<T>;
        public raise: T;

        constructor() {
            this._events = new Array<T>();
            this.raise = <any>this._raise;
        }

        private _raise(...args: any[]): void {
            this._events.forEach((e: T) => {
                var toCall: any = e;
                toCall.apply(toCall, args);
            });
        }

        public add(fun: T): void {
            this._events.push(fun);
        }

        public remove(fun: T): boolean {
            var i = this._events.indexOf(fun);
            if (i == -1) return false;
            this._events.splice(i, 1);
            return true;
        }
    }
}

export = internal;