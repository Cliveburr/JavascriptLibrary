
export interface OnChange {
    (namespace: string, newValue: any, oldValue: any, type: OnChangeType): void;
}

export enum OnChangeType {
    change = 0,
    add = 1,
    remove = 2
}

export interface OnChangeSchedule {
    name: string;
    newValue: any;
    oldValue: any;
    type: OnChangeType;
}

export function watcher(base: Object, namespace: string, onchange: OnChange): void {
    if (typeof base === 'undefined')
        throw 'Can\'t watcher over undefined base!';

    let nss = NS.parse(base, namespace);
    if (nss.length == 1) {
        let control = WatcherControl.of(base);
        control.setOnChange(namespace, onchange);
    }
    else if (nss.length > 1) {
        let valid = nss[nss.length - 1].lastParent();
        if (valid) {
            if (valid.next) {
                let control = WatcherControl.of(valid.value);
                control.setTarget(valid.name, valid.next.fullName(), onchange);
            }
            else {
                let control = WatcherControl.of(valid.value);
                control.setOnChange(valid.name, onchange);
            }
        }
        else {
            let control = WatcherControl.of(base);
            control.setTarget(nss[0].name, nss[1].fullName(), onchange);
        }
    }
    else
        throw `Invalid namespace: '${namespace}'`;
}

export function removeWatcher(base: Object, namespace: string, onchange: OnChange): void {
    let nss = NS.parse(base, namespace);
    if (nss.length == 1) {
        let control = WatcherControl.of(base);
        control.remove(namespace, onchange);
    }
    else {
        let parent = nss[nss.length - 1].back;
        if (parent.exist()) {
            let control = WatcherControl.of(parent.value);
            control.remove(parent.next.name, onchange);
        }    
    }
}

export class NS {
    private _a: NS;

    private constructor(
        private _base: Object,
        private _b: NS,
        private _name: string
    ) {
    }

    public get name(): string { return this._name; }
    public get value(): Object { return this._base[this._name]; }
    public get next(): NS { return this._a; }
    public get back(): NS { return this._b; }

    public static parse(base: Object, namespace: string): Array<NS> {
        let ps = namespace.split('.');
        let tr: Array<NS> = [], b: NS, f: NS, l = base;
        for (let p of ps) {
            f = new NS(l, b, p);
            tr.push(f);
            if (b)
                b._a = f;
            if (l)
                l = l[p];
            b = f;
        }
        return tr;
    }

    public exist(): boolean {
        return typeof this._base == 'undefined' ? false : typeof this._base[this._name] != 'undefined';
    }

    public lastParent(): NS {
        if (this.exist())
            return this;
        else
            if (this._b)
                return this._b.lastParent();
            else
                return undefined;
    }

    public fullName(): string {
        if (this._a)
            return `${this._name}.${this._a.fullName()}`;
        else
            return this._name;
    }
}

export class WatcherControl {
    private _props: Array<WatcherProperty>;

    private constructor(
        private _obj: Object) {
        this._props = [];
    }

    public get obj(): Object { return this._obj; }

    public static of(obj: Object): WatcherControl {
        let control = obj['$$watcher'] as WatcherControl;
        if (!control) {
            control = new WatcherControl(obj);
            Object.defineProperty(obj, '$$watcher', {
                enumerable: false,
                value: control
            });
        }
        return control;
    }

    public setOnChange(prop: string, onchange: OnChange): void {
        let wp = this.checkProp(prop);
        wp.onChange.push(onchange);
    }

    public setTarget(prop: string, namespace: string, onchange: OnChange): void {
        let wp = this.checkProp(prop);
        let moveon = () => {
            wp.onChange.splice(wp.onChange.indexOf(moveon), 1);
            watcher(this._obj[prop], namespace, onchange);
        };
        wp.onChange.push(moveon);
    }

    public remove(prop: string, onchange: OnChange): void {
        let wp = this.checkProp(prop);
        if (wp) {
            let i = wp.onChange.indexOf(onchange);
            if (i > -1) {
                wp.onChange.splice(i, 1);
            }
            if (wp.onChange.length == 0) {
                let iwp = this._props.indexOf(wp);
                this._props.splice(iwp, 1);
            }
        }
    }

    private checkProp(prop: string): WatcherProperty {
        let wp = this._props.filter((f) => f.name === prop);
        if (wp.length == 0) {
            let np = new WatcherProperty(this, prop);
            this._props.push(np);
            return np;
        }
        else
            return wp[0];
    }
}

export class WatcherProperty {
    private _desc: PropertyDescriptor;
    private _value: any;
    private _knowProps: Array<string>;
    private _toCheckProps: number;
    //private _onChangeSchedule: Array<OnChangeSchedule>;
    //private _toChangeSchedule: number;
    private _array: Array<any>;

    public onChange: OnChange[];

    public constructor(
        private _control: WatcherControl,
        private _name: string) {

        //this._onChangeSchedule = [];
        this.onChange = [];
        let obj = _control.obj;

        if (typeof HTMLElement !== 'undefined' && obj instanceof HTMLElement) {
            this._desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, _name);
        }
        else {
            this._desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), _name);
        }

        if (typeof obj[_name] !== 'undefined') {
            this._value = obj[_name];
            delete obj[_name];
        }

        Object.defineProperty(obj, _name, {
            configurable: true,
            enumerable: true,
            get: this.inGet.bind(this),
            set: this.inSet.bind(this)
        });

        this.checkValueProps;        
    }

    public get name(): string { return this._name; }

    private inGet(): any {
        if (!this._array)
            this.setCheckProps();
        return this._value;
    }

    private inSet(value: any): void {
        let oldVal = this._value;
        this._value = value;

        this.checkValueProps();

        this.raiseOnChange(this._name, value, oldVal, OnChangeType.change);

        if (this._desc && this._desc.set) {
            this._desc.set.call(this._value, value);
        }
    }

    private raiseOnChange(namespace: string, newValue: any, oldValue: any, type: OnChangeType): void {
        for (let onChange of this.onChange) {
            onChange(namespace, newValue, oldValue, type);
        }
    }

    private setCheckProps(): void {
        if (this._toCheckProps) {
            clearTimeout(this._toCheckProps);
            this.checkProps();
        }
        this._knowProps = [];
        for (let p in this._value) {
            this._knowProps.push(p);
        }
        this._toCheckProps = setTimeout(this.checkProps.bind(this));
    }

    private checkProps(): void {
        this._toCheckProps = null;
        //if (this._toChangeSchedule)
        //    clearTimeout(this._toChangeSchedule);

        let nps = [];
        for (let p in this._value) {
            let h = this._knowProps.filter(f => f == p);
            if (h.length == 0) {
                // this._onChangeSchedule.push({
                //     name: p,
                //     newValue: this._value[p],
                //     oldValue: undefined,
                //     type: OnChangeType.add
                // });
                this.raiseOnChange(`${this._name}.${p}`, this._value[p], undefined, OnChangeType.add);
                watcher(this._value, p, this.onChildChange.bind(this));
            }
            nps.push(p);
        }
        for (let p of this._knowProps) {
            let h = nps.filter(f => f == p);
            if (h.length == 0) {
                // this._onChangeSchedule.push({
                //     name: p,
                //     newValue: undefined,
                //     oldValue: undefined,
                //     type: OnChangeType.remove
                // });
                this.raiseOnChange(`${this._name}.${p}`, this._value[p], undefined, OnChangeType.remove);
                removeWatcher(this._value, p, this.onChildChange.bind(this));
            }
        }

        //this._toChangeSchedule = setTimeout(this.raiseSchedule.bind(this));
        //this.raiseSchedule();
    }

    // private raiseSchedule(): void {
    //     //this._toChangeSchedule = null;
    //     for (let s of this._onChangeSchedule) {
    //         this.raiseOnChange(`${this._name}.${s.name}`, s.newValue, s.oldValue, s.type);
    //     }
    //     this._onChangeSchedule = [];
    // }

    private onChildChange(namespace: string, newValue: any, oldValue: any, type: OnChangeType): void {
        this.raiseOnChange(`${this._name}.${namespace}`, newValue, oldValue, type);
    }

    private checkValueProps(): void {
        this._array = null;
        
        if (!this._value)
            return;

        if (Array.isArray(this._value)) {
            this.prepareArray();
        }
        else {
            for (let prop in this._value) {
                watcher(this._value, prop, this.onChildChange.bind(this));
            }
        }
    }

    private prepareArray(): void {
        this._array = Array.prototype.slice.call(this._value);

        for (var i = 0; i < this._array.length; i++) {
            this.setArrayItem(i);
        }

        Object.defineProperties(this._value, {
            'push': {
                enumerable: false,
                value: (...items) => {
                    let bef = this._array.length;
                    Array.prototype.push.apply(this._array, items);
                    if (items.length > 0) {
                        for (let a = 0; a < items.length; a++) {
                            this.setArrayItem(bef + a);
                        }
                        for (let a = 0; a < items.length; a++) {
                            this.raiseOnChange(`${this._name}.${a.toString()}`, items[a], undefined, OnChangeType.add);
                        }
                    }
                }
            },
            'pop': {
                enumerable: false,
                value: () => {
                    let val = Array.prototype.pop.apply(this._array);
                    this.clearArrayItem(1);
                    this.raiseOnChange((this._array.length).toString(), undefined, val, OnChangeType.remove);
                    return val;
                }
            },
            'shift': {
                enumerable: false,
                value: () => {
                    let val = Array.prototype.shift.apply(this._array);
                    this.clearArrayItem(1);
                    this.raiseOnChange('0', null, val, OnChangeType.remove);
                    return val;
                }
            },
            'unshift': {
                enumerable: false,
                value: (...items) => {
                    let bef = this._array.length;
                    let val = Array.prototype.unshift.apply(this._array, items);
                    if (items.length > 0) {
                        for (let a = 0; a < items.length; a++) {
                            this.setArrayItem(bef + a);
                        }
                        for (let a = 0; a < items.length; a++) {
                            this.raiseOnChange(a.toString(), items[a], null, OnChangeType.add);
                        }
                    }
                    return val;
                }
            },
            'splice': {
                enumerable: false,
                value: (...args) => {
                    let bef = this._array.length;
                    let val = Array.prototype.splice.apply(this._array, args);
                    if (args.length == 1) {
                        this.clearArrayItem(bef - args[0]);
                    }
                    else if (args.length > 1) {
                        var tot = (args.length - 2) - args[1];
                        if (tot > 0) {
                            for (let a = 0; a < tot; a++) {
                                this.setArrayItem(bef + a);
                            }
                        }
                        else if (tot < 0) {
                            this.clearArrayItem(tot * -1);
                        }
                    }
                    if (val.length > 0) {
                        for (let a = 0; a < val.length; a++) {
                            this.raiseOnChange(`${this._name}.${(a + args[0]).toString()}`, val[a], null, OnChangeType.remove);
                        }
                    }
                    return val;
                }
            }
        });
    }

    private setArrayItem(index: number): void {
        Object.defineProperty(this._value, index.toString(), {
            configurable: true,
            enumerable: true,
            get: () => {
                return this._array[index];
            },
            set: (val) => {
                var oldVal = this._array[index];
                this._array[index] = val;
                this.raiseOnChange(index.toString(), val, oldVal, OnChangeType.change);
            }
        });
    }

    private clearArrayItem(count: number): void {
        for (var i = 0; i < count; i++) {
            let index = this._value.length - 1;

            Object.defineProperty(this._value, index.toString(), {
                configurable: true,
                enumerable: true,
                writable: true,
                value: 1
            });

            Array.prototype.pop.call(this._value);
        }
    }
}