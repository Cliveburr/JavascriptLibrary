
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

        public Get = (id: string): T => {
            if (typeof this._data[id] === "undefined")
                return null;
            else
                return this._data[id];
        }

        public Has = (id: string): boolean => {
            return typeof this._data[id] !== "undefined";
        }

        public Remove = (id: string): boolean => {
            if (typeof this._data[id] === "undefined") {
                return false;
            }
            else {
                delete this._data[id];
                this._count--;
                return true;
            }
        }

        public List = (): Array<T> => {
            var ta = this;
            return Object.keys(this._data).map(function (e: string) {
                return ta._data[e];
            });
        }

    }

    export class AutoDictonary<T> extends Dictonary<T> {

        constructor(public Chars: string, public Lenght: number) {
            super();
        }

        public GenerateID = (): string => {
            var tr: string;
            do {
                tr = "";
                for (var i = 0; i < this.Lenght; i++) {
                    tr += this.Chars[Math.floor(Math.random() * this.Chars.length)];
                }
            } while (this.Has[tr]);
            return tr;
        }

        public ASet = (item: T): string => {
            var id = this.GenerateID();
            this.Set(id, item);
            return id;
        }

    }
}

export = internal;