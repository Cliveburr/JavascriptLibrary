
export interface IControllable extends HTMLElement {
    ctr: Object;
}

export interface IClassType {
    new (el: HTMLElement): Object;
}

export interface IClassDefault {
    default: IClassType;
}

export interface IResolve {
    (name: string): Promise<IClassDefault>;
}

export class ControllerManager {
    private static _cls: { [name: string]: IClassType } = {};
    private static _resolve: IResolve;

    public static checkAndInstance(el: IControllable): void {
        let ctr = el.attributes.getNamedItem('ctr');
        if (ctr) {
            if (this._cls[ctr.value]) {
                el.ctr = new this._cls[ctr.value](el);
            }
            else {
                this.tryResolve(ctr.value, el);
            }
        }
    }

    public static set(name: string, cls: IClassType): void {
        this._cls[name] = cls;
    }

    public static setResolver(resolve: IResolve): void {
        this._resolve = resolve;
    }

    private static async tryResolve(cls: string, el: IControllable): Promise<void> {
        let rCls = await this._resolve(cls);
        if (rCls && rCls.default) {
            this.set(cls, rCls.default);
            el.ctr = new rCls.default(el);
        }
        else {
            throw `Controller ${cls} not found!`;
        }
    }
}