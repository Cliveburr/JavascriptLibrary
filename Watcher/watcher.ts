
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
    var parent = nss[nss.length - 1].lastParent();

    if (parent.value) {
        var control = WatcherControl.of(parent.value);
        control.setOnChange(nss[nss.length - 1].name, onchange);
    }
    else {
        var valid = parent.getLastValid();
        var control = WatcherControl.of(valid.value);
        control.setTarget(valid.next.name, namespace, onchange);
    }

    // if (nss.length == 1) {
    //     let control = WatcherControl.of(base);
    //     control.setOnChange(nss[0].name, onchange);
    // }
    // else if (nss.length > 1) {
    //     let valid = nss[nss.length - 1].lastParent();
    //     if (valid) {
    //         let control = WatcherControl.of(valid.value);
    //         control.setTarget(valid.after.name, valid.after.after.fullName(), onchange);
    //     }
    //     else {
    //         let control = WatcherControl.of(base);
    //         control.setTarget(valid[0].name, valid[1].fullName(), onchange);
    //     }
    // }
    // else
    //     throw `Invalid namespace: '${namespace}'`;
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
    public get after(): NS { return this._a; }

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
        }
        if (b)
            b._a = f;
        return tr;
    }

    public exist(): boolean {
        return !!this._base[this._name];
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
        var wp = this.checkProp(prop);
        wp.onChange.push(onchange);
    }

    public setTarget(prop: string, namespace: string, onchange: OnChange): void {
        var wp = this.checkProp(prop);
        var moveon = () => {
            let i = wp.onChange.indexOf(moveon);
            wp.onChange.splice(i, 1);
            watcher(this._obj, namespace, onchange);
        };
        wp.onChange.push(moveon);
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
    }

    public get name(): string { return this._name; }

    private inGet(): any {
        this.setCheckProps();
        return this._value;
    }

    private inSet(value: any): void {
        let oldVal = this._value;
        this._value = value;

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
            if (h.length == 0)
                // this._onChangeSchedule.push({
                //     name: p,
                //     newValue: undefined,
                //     oldValue: undefined,
                //     type: OnChangeType.remove
                // });
                this.raiseOnChange(`${this._name}.${p}`, this._value[p], undefined, OnChangeType.add);
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
}