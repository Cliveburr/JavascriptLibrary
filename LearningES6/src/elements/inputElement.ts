import { IOnScope } from '../binding/scope';

export interface IInputModel {
    placeholder: string;
    label: string;
    value: string;
}

var template = `<label><span></span><input type="text"></input></label>`;

export class InputElement extends HTMLElement implements IOnScope {
    private _root: webcomponents.ShadowRootPolyfill;
    private _i: HTMLInputElement;
    private _s: HTMLSpanElement;
    private _model: IInputModel;

    public createdCallback() {
        this.innerHTML = '';
        this._root = this.createShadowRoot();
        this._root.innerHTML = template;
        this._s = this._root.querySelector('span');
        this._i = this._root.querySelector('input');
        this._i.onchange = this._i_onkeypress.bind(this);
    }

    public onScope(data: any): void {
        let modelAttr = this.attributes.getNamedItem('model');
        if (modelAttr && data[modelAttr.value]) {
            this._model = data[modelAttr.value];
            this.refresh();
        }
    }

    private refresh(): void {
        this._s.innerText = this._model.label || '';
        this._i.placeholder = this._model.placeholder;
    }

    private _i_onkeypress(ev: KeyboardEvent): void {
        this._model.value = this._i.value;
    }
}