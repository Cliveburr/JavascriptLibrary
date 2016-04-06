interface Array<T> {
    removeAll(element: T): T[];
    remove(element: T): T[];
    has(test: (element: T) => boolean): boolean;
    has(element: T): boolean;
    last(): T;
    filterOne(filter: (item: T) => boolean): T;
}

Object.defineProperties(Array.prototype, {
    "removeAll": {
        enumerable: false,
        value: function (element) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == element) {
                    this.splice(i, 1);
                    i--;
                }
            }
            return this;
        }
    },
    "remove": {
        enumerable: false,
        value: function (element) {
            var i = this.indexOf(element);
            if (i != -1) this.splice(i, 1);
            return this;
        }
    },
    "has": {
        enumerable: false,
        value: function (test: Object) {
            var func: any = test;
            if (!test.isFunction()) {
                func = function (e) {
                    return e === test;
                };
            }
            for (var i = 0; i < this.length; i++) {
                if (func(this[i])) return true;
            }
            return false;
        }
    },
    "last": {
        enumerable: false,
        value: function () {
            return this[this.length - 1];
        }
    },
    "filterOne": {
        enumerable: false,
        value: function (filter) {
            var f = this.filter(filter);
            if (f.length > 0)
                return f[0];
            else
                return null;
        }
    },
});

interface String {
    trim(): string;
    ltrim(): string;
    rtrim(): string;
    sltrim(chars: string): string;
    srtrim(chars: string): string;
    strim(chars: string): string;
    startsWith(prefix: string): boolean;
    endsWith(prefix: string): boolean;
    format(...params: string[]): string;
}

var format = function () {
    var ticks = this.match(/(\{[0-9]+\})/g);
    if (!ticks)
        return this;

    var tr = this;
    for (var i = 0; i < ticks.length; i++) {
        var value: any = /\{([0-9])+\}/.exec(ticks[i])[1];
        tr = tr.replace(ticks[i], arguments[value]);
    }
    return tr;
}

Object.defineProperties(String.prototype, {
    'trim': {
        enumerable: false,
        value: String.prototype.trim || function () {
            return this.replace(/^\s+|\s+$/g, '');
        }
    },
    'ltrim': {
        enumerable: false,
        value: function () {
            return this.replace(/^\s+/, '');
        }
    },
    'rtrim': {
        enumerable: false,
        value: function () {
            return this.replace(/\s+$/, '');
        }
    },
    'strim': {
        enumerable: false,
        value: function (chars) {
            if (chars === undefined)
                chars = '\s';
            return this.sltrim(chars).srtrim(chars);
        }
    },
    'sltrim': {
        enumerable: false,
        value: function (chars) {
            if (chars === undefined)
                chars = '\s';
            return this.replace(new RegExp('^[' + chars + ']+'), '');
        }
    },
    'srtrim': {
        enumerable: false,
        value: function (chars) {
            if (chars === undefined)
                chars = '\s';
            return this.replace(new RegExp('[' + chars + ']+$'), '');
        }
    },
    'startsWith': {
        enumerable: false,
        value: function (prefix) {
            return this.indexOf(prefix) === 0;
        }
    },
    'endsWith': {
        enumerable: false,
        value: function (suffix) {
            return this.match(suffix + '$') == suffix;
        }
    },
    'format': {
        enumerable: false,
        value: format
    }
});

interface Object {
    isFunction(): boolean;
}

Object.defineProperties(Object.prototype, {
    'isFunction': {
        enumerable: false,
        value: function () {
            return typeof this === "function";
        }
    }
});

module JSSystem {
    export class Dictonary<T> {
        private _data: any = {};
        private _count: number = 0;
        get Count() { return this._count; }

        public set(id: string, item: T): boolean {
            if (typeof this._data[id] !== "undefined") {
                return false;
            }
            else {
                this._data[id] = item;
                this._count++;
                return true;
            }
        }

        public get(id: string): T {
            if (typeof this._data[id] === "undefined")
                return null;
            else
                return this._data[id];
        }

        public has(id: string): boolean {
            return typeof this._data[id] !== "undefined";
        }

        public remove(id: string): boolean {
            if (typeof this._data[id] === "undefined") {
                return false;
            }
            else {
                delete this._data[id];
                this._count--;
                return true;
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
        public static basicChars = 'ASDFGHJKLQWERTYUIOPZXCVBNMasdfghjklqwertyuiopzxcvbnm0123456789';

        constructor(
            public chars: string,
            public lenght: number) {
            super();
        }

        public generateID(): string {
            var tr: string;
            do {
                tr = "";
                for (var i = 0; i < this.lenght; i++) {
                    tr += this.chars[Math.floor(Math.random() * this.chars.length)];
                }
            } while (this.has[tr]);
            return tr;
        }

        public autoSet(item: T): string {
            var id = this.generateID();
            this.set(id, item);
            return id;
        }
    }

    export function RND(min: number, max: number): number {
        var range = Math.abs(max - min) + 1;
        return Math.floor(range * Math.random());
    }
}

import JS = JSSystem;