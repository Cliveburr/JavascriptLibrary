
export interface IOnChange<T> {
    (v: T): void
}

export interface IObserver<T> {
    (value: T): T;
    (): T;
    isObserver: boolean;
    on(handle: IOnChange<T>): void;
    off(handle: IOnChange<T>): void;
}

export function Observer<T>(value?: T): IObserver<T> {
    let o = new Observable<T>(value);
    let t = o.value.bind(o) as IObserver<T>;
    Object.defineProperties(t, {
        'isObserver': {
            enumerable: false,
            get: () => { return true; }
        },
        'on': {
            enumerable: false,
            value: o.on.bind(o)
        },
        'off': {
            enumerable: false,
            value: o.off.bind(o)
        }
    });
    return t;
}

export class Observable<T> {
    private _hs: Array<IOnChange<T>>;

    public constructor(
        private _v: T
    ) {
        this._hs = [];
    }

    public on(handle: IOnChange<T>): void {
        this._hs.push(handle);
    }

    public off(handle: IOnChange<T>): void {
        let i = this._hs.indexOf(handle);
        if (i > -1)
            this._hs.splice(i, 1);
    }

    public value(value: T): T {
        if (typeof value != 'undefined') {
            this._v = value;
            this.notify();
        }
        return this._v;
    }

    private notify(): void {
        for (let h of this._hs) {
            h(this._v);
        }
    }
}

export interface IOnChangeArray<T> {
    (v: Array<T>, index: number, type: OnChangeType): void
}

export enum OnChangeType {
    change = 0,
    add = 1,
    remove = 2
}

export interface PureArray<T> {
    [index: number]: T;
}

export interface IObserverArray<T> {
    (value: T): PureArray<T>;
    (): PureArray<T>;
    isObserverArray: boolean;
    on(handle: IOnChangeArray<T>): void;
    off(handle: IOnChangeArray<T>): void;
    length: number;
    push(...items: Array<T>): number;
    pop(): T;
    shift(): T;
    unshift(...items: Array<T>): number;
}

export function ObserverArray<T>(value?: Array<T>): IObserverArray<T> {
    let o = new ObservableArray<T>(value);
    let t = o.value.bind(o) as IObserverArray<T>;
    Object.defineProperties(t, {
        'isObserverArray': {
            enumerable: false,
            get: () => { return true; }
        },
        'on': {
            enumerable: false,
            value: o.on.bind(o)
        },
        'off': {
            enumerable: false,
            value: o.off.bind(o)
        },
        'length': {
            enumerable: false,
            get: o.length.bind(o)
        },
        'push': {
            enumerable: false,
            value: o.push.bind(o)
        },
        'pop': {
            enumerable: false,
            value: o.pop.bind(o)
        },
        'shift': {
            enumerable: false,
            value: o.shift.bind(o)
        },
        'unshift': {
            enumerable: false,
            value: o.unshift.bind(o)
        }
    });
    return t;
}

export class ObservableArray<T> {
    private _hs: Array<IOnChangeArray<T>>;
    private _p: PureArray<T>;

    public constructor(
        private _v: Array<T>
    ) {
        this._hs = [];
        this.prepare();
    }

    public on(handle: IOnChangeArray<T>): void {
        this._hs.push(handle);
    }

    public off(handle: IOnChangeArray<T>): void {
        let i = this._hs.indexOf(handle);
        if (i > -1)
            this._hs.splice(i, 1);
    }

    public value(value: Array<T>): PureArray<T> {
        if (typeof value != 'undefined') {
            this._v = value;
            this.prepare();
            this.notify(-1, OnChangeType.add);
        }
        return this._p;
    }

    private notify(index: number, type: OnChangeType): void {
        for (let h of this._hs) {
            h(this._v, index, type);
        }
    }

    private prepare(): void {
        if (!Array.isArray(this._v))
            throw 'The value of ObserverArray must be Array!';
        this._p = {};
        for (var i = 0; i < this._v.length; i++) {
            this.setArrayItem(i);
        }        
    }

    private setArrayItem(index: number): void {
        Object.defineProperty(this._p, index.toString(), {
            configurable: true,
            enumerable: true,
            get: () => {
                return this._v[index];
            },
            set: (val: T) => {
                this._v[index] = val;
                this.notify(index, OnChangeType.change);
            }
        });
    }

    private clearArrayItem(count: number): void {
        for (var i = 0; i < count; i++) {
            let index = this._v.length - i;

            Object.defineProperty(this._p, index.toString(), {
                configurable: true,
                enumerable: true,
                writable: true,
                value: 1
            });

            delete this._p[index];
        }
    }

    public length(): number {
        return this._v.length;
    }

    public push(...items: Array<T>): number {
        let bef = this._v.length;
        let val = Array.prototype.push.apply(this._v, items);
        if (items.length > 0) {
            for (let a = bef; a < bef + items.length; a++) {
                this.setArrayItem(a);
            }
            for (let a = bef; a < bef + items.length; a++) {
                this.notify(a, OnChangeType.add);
            }
        }
        return val;
    }

    public pop(): T {
        this.notify(this._v.length - 1, OnChangeType.remove);
        let val = Array.prototype.pop.apply(this._v);
        this.clearArrayItem(1);
        return val;
    }

    public shift(): T {
        this.notify(0, OnChangeType.remove);
        let val = Array.prototype.shift.apply(this._v);
        this.clearArrayItem(1);
        return val;
    }

    public unshift(...items: Array<T>): number {
        let bef = this._v.length;
        let val = Array.prototype.unshift.apply(this._v, items);
        if (items.length > 0) {
            for (let a = bef; a < bef + items.length; a++) {
                this.setArrayItem(a);
            }
            for (let a = 0; a < items.length; a++) {
                this.notify(a, OnChangeType.add);
            }
        }
        return val;
    }
}