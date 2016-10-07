import { BaseElement } from './baseElement';

export interface IClassType {
    new (el: HTMLElement): Object;
}

export interface IClassDefault {
    default: IClassType;
}

export interface IResolve {
    (name: string): Promise<IClassDefault>;
}

export class ControllerElement extends BaseElement<any> {
    public ctr: any;

    public createdCallback() {
        this.checkAndInstance();
    }

    public attachedCallback() {
    }

    public async checkAndInstance(): Promise<void> {
        let ctr = this.attributes.getNamedItem('ctr');
        if (ctr) {
            let cls = ControllerManager.get(ctr.value);
            if (cls) {
                this.ctr = new cls(this);
            }
            else {
                let cls = await ControllerManager.tryResolve(ctr.value);
                this.ctr = new cls(this);
            }
        }
    }
}

export class ControllerManager {
    private static _cls: { [name: string]: IClassType } = {};
    private static _resolve: IResolve;

    public static get(name: string): IClassType {
        return this._cls[name];
    }

    public static set(name: string, cls: IClassType): void {
        this._cls[name] = cls;
    }

    public static setResolver(resolve: IResolve): void {
        this._resolve = resolve;
    }

    public static async tryResolve(cls: string): Promise<IClassType> {
        return new Promise<IClassType>(async (e, r) => {
            let rCls = await this._resolve(cls);
            if (rCls && rCls.default) {
                this.set(cls, rCls.default);
                e(rCls.default);
            }
            else {
                r(`Controller '${cls}' not found!`);
            }
        });
    }
}