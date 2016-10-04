import { IOnScope } from '../binding/scope';

export interface ISpanModel {
    label: string;
}

export class SpanElement extends HTMLElement implements IOnScope {
    private _root: webcomponents.ShadowRootPolyfill;
    private _s: HTMLSpanElement;
    private _model: ISpanModel;

    public createdCallback() {
        this.innerHTML = '';
        this._root = this.createShadowRoot();
        this._s = document.createElement('span');
        this._root.appendChild(this._s);
    }

    public onScope(data: any): void {
        let modelAttr = this.attributes.getNamedItem('model');
        if (modelAttr) {
            if (this['repeatID']) {
                let rps = this['repeatID'].split('.');
                let m = data;
                for (let rp of rps) {
                    m = m[rp];
                }
                this._model = m;
            } 
            else if (data[modelAttr.value]) {
                this._model = data[modelAttr.value];
            }
            this.refresh();
        }
    }

    private refresh(): void {
        this._s.innerText = this._model.label || '';
    }
}