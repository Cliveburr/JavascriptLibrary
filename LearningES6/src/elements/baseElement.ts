export interface IScopeable {
    onScope(data: any): void;
}

export abstract class BaseElement<T> extends HTMLElement {
    public model: T;
    public scope: any;
    public isScope: boolean;
    //private _scopeCallBack: Array<(scope: any) => void>;

    public scopeInitialize(): void {
        this.isScope = true;
        //this._scopeCallBack = [];
    }

    public setScope(scope: any): void {
        if (!this.isScope)
            throw `Need to initialize the scope before set!`;
        this.scope = scope;
        //this.callOnScope();
        this.callOnScopeChilds(this, false);
    }

    // private callOnScope(): void {
    //     for (let cb of this._scopeCallBack) {
    //         cb(this.scope);
    //     }
    // }

    private callOnScopeChilds(el: Node, me: boolean): void {
        if (el['onScope']) {
            el['onScope'](this.scope);
        }
        if (el['isScope'] && me)
            return;
        for (let i = 0; i < el.childNodes.length; i++) {
            this.callOnScopeChilds(el.childNodes.item(i), true);
        }
    }    

    public checkScope(): void {
        if (this['onScope'] && this.parentNode) {
            let parentScope = this.getClosedScope(this.parentNode);
            if (parentScope) {
                this['onScope'](parentScope.scope);
            }
        }
    }

    // public onScope(callBack: (scope: any) => void): void {
    //     if (this.isScope) {
    //         this._scopeCallBack.push(callBack);
    //         if (this.scope) {
    //             callBack(this.scope);
    //         }
    //     }
    //     else {
    //         let parentScope = this.getClosedScope(this.parentElement);
    //         if (parentScope) {
    //             parentScope.onScope(callBack);
    //         }
    //         else {
    //             throw `None scope has found!`;
    //         }
    //     }
    // }

    private getClosedScope(el: Node): BaseElement<T> {
        if (el['isScope']) {
            return el as BaseElement<T>;
        }
        else {
            if (el.parentNode) {
                return this.getClosedScope(el.parentNode);
            }
            else {
                return null;
            }
        }
    }

    public getModel(): T {
        let am = this.attributes.getNamedItem('model');
        if (!am)
            return undefined;
        let ns = this.mountNamespace();
        //let ps =  ns.split('.');
        let so = this.getClosedScope(this.parentNode);
        let tr = so.scope;
        for (let p of ns) {
            if (!tr)
                return undefined;
            tr = tr[p];
        }
        return tr;
    }

    private mountNamespace(): Array<string> {
        let tr = [];
        let te = this as Node;
        while (te) {
            if (te.hasOwnProperty('isScope')) {
                break;
            }
            if (te.hasOwnProperty('$$RID')) {
                tr.unshift(te['$$RID']);
            }
            let am = te.attributes.getNamedItem('model');
            if (am && am.value != '') {
                tr.unshift(am.value);
            }
            te = te.parentNode;
        }
        return tr;
    }
}