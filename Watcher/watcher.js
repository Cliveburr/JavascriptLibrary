"use strict";
(function (OnChangeType) {
    OnChangeType[OnChangeType["change"] = 0] = "change";
    OnChangeType[OnChangeType["add"] = 1] = "add";
    OnChangeType[OnChangeType["remove"] = 2] = "remove";
})(exports.OnChangeType || (exports.OnChangeType = {}));
var OnChangeType = exports.OnChangeType;
function watcher(base, namespace, onchange) {
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
exports.watcher = watcher;
class NS {
    constructor(_base, _b, _name) {
        this._base = _base;
        this._b = _b;
        this._name = _name;
    }
    get name() { return this._name; }
    get value() { return this._base[this._name]; }
    get after() { return this._a; }
    static parse(base, namespace) {
        let ps = namespace.split('.');
        let tr = [], b, f, l = base;
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
    exist() {
        return !!this._base[this._name];
    }
    lastParent() {
        if (this.exist())
            return this;
        else if (this._b)
            return this._b.lastParent();
        else
            return undefined;
    }
    fullName() {
        if (this._a)
            return `${this._name}.${this._a.fullName()}`;
        else
            return this._name;
    }
}
exports.NS = NS;
class WatcherControl {
    constructor(_obj) {
        this._obj = _obj;
        this._props = [];
    }
    get obj() { return this._obj; }
    static of(obj) {
        let control = obj['$$watcher'];
        if (!control) {
            control = new WatcherControl(obj);
            Object.defineProperty(obj, '$$watcher', {
                enumerable: false,
                value: control
            });
        }
        return control;
    }
    setOnChange(prop, onchange) {
        var wp = this.checkProp(prop);
        wp.onChange.push(onchange);
    }
    setTarget(prop, namespace, onchange) {
        var wp = this.checkProp(prop);
        var moveon = () => {
            let i = wp.onChange.indexOf(moveon);
            wp.onChange.splice(i, 1);
            watcher(this._obj, namespace, onchange);
        };
        wp.onChange.push(moveon);
    }
    checkProp(prop) {
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
exports.WatcherControl = WatcherControl;
class WatcherProperty {
    constructor(_control, _name) {
        this._control = _control;
        this._name = _name;
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
    get name() { return this._name; }
    inGet() {
        this.setCheckProps();
        return this._value;
    }
    inSet(value) {
        let oldVal = this._value;
        this._value = value;
        this.raiseOnChange(this._name, value, oldVal, OnChangeType.change);
        if (this._desc && this._desc.set) {
            this._desc.set.call(this._value, value);
        }
    }
    raiseOnChange(namespace, newValue, oldValue, type) {
        for (let onChange of this.onChange) {
            onChange(namespace, newValue, oldValue, type);
        }
    }
    setCheckProps() {
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
    checkProps() {
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
    onChildChange(namespace, newValue, oldValue, type) {
        this.raiseOnChange(`${this._name}.${namespace}`, newValue, oldValue, type);
    }
}
exports.WatcherProperty = WatcherProperty;
//# sourceMappingURL=watcher.js.map