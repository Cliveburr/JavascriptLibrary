
export interface IScopeable extends HTMLElement {
    //isScope: boolean;
    scope: Scope;
    initializeScope(): void;
}

export interface IOnScope extends HTMLElement {
    onScope(data: any): void;
}

// export interface IScopeOn {
//     (scope: any): void;
// }

export class Scope {
    public data: any;

    //private _scopeCallBack: Array<IScopeOn>;

    public constructor(
        private _anchor: HTMLElement
    ) {
        //this._scopeCallBack = [];
    }

    public set(data: any): void {
        this.data = data;
        this.callOnScope();
    }

    private callOnScope(): void {
        // for (let cb of this._scopeCallBack) {
        //     cb(this.data);
        // }
        this.callOnScopeChilds(this._anchor);
    }

    private callOnScopeChilds(el: Node): void {
        if (el['onScope']) {
            el['onScope'](this.data);
        }
        for (let i = 0; i < el.childNodes.length; i++) {
            this.callOnScopeChilds(el.childNodes.item(i));
        }
    }

    // public on(callBack: IScopeOn): void {
    //     this._scopeCallBack.push(callBack);
    // }

    // public remove(callBack: IScopeOn): void {
    //     let i = this._scopeCallBack.indexOf(callBack);
    //     if (i > -1)
    //         this._scopeCallBack.splice(i, 1);
    // }
}

// class ScopeManagerInstance {
//     public getClosedScope(el: HTMLElement): IScopeable {
//         if (el['scope']) {
//             return <IScopeable>el;
//         }
//         else {
//             if (el.parentElement) {
//                 return this.getClosedScope(el.parentElement);
//             }
//             else {
//                 return null;
//             }
//         }
//     }
// }

// export var ScopeManager: ScopeManagerInstance = new ScopeManagerInstance();