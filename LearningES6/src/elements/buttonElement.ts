import { IOnScope } from '../binding/scope';

export interface IButtonModel {
    text: string;
    onclick: (ev: MouseEvent) => void;
}

export class ButtonElement extends HTMLElement implements IOnScope {
    private _root: webcomponents.ShadowRootPolyfill;
    private _i: HTMLInputElement;
    private _model: IButtonModel;

    public createdCallback() {
        this.innerHTML = '';
        this._root = this.createShadowRoot();
        this._i = document.createElement('input');
        this._i.type = 'button';
        this._i.onclick = this._i_onclick.bind(this);
        this._root.appendChild(this._i);
    }

    public onScope(data: any): void {
        let modelAttr = this.attributes.getNamedItem('model');
        if (modelAttr && data[modelAttr.value]) {
            this._model = data[modelAttr.value];
            this.refresh();
        }
    }

    private refresh(): void {
        this._i.value = this._model.text;
    }

    private _i_onclick(ev: MouseEvent): void {
        this._model.onclick(ev);
    }
}