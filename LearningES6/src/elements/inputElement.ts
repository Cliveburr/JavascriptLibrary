import { BaseElement } from './baseElement';

export interface IInputModel {
    placeholder?: string;
    text: string;
    value?: string;
}

var template = `<label><span></span><input type="text"></input></label>`;

export class InputElement extends BaseElement<IInputModel> {
    private _i: HTMLInputElement;
    private _s: HTMLSpanElement;

    public createdCallback() {
        let root = this.createShadowRoot();
        root.innerHTML = template;
        this._s = root.querySelector('span');
        this._i = root.querySelector('input');
        this._i.onchange = this._i_onkeypress.bind(this);
    }

    public onScope(data: any): void {
        if (this.model = this.getModel()) {
            this._s.innerText = this.model.text || '';
            this._i.placeholder = this.model.placeholder;
        }
    }

    private _i_onkeypress(ev: KeyboardEvent): void {
        this.model.value = this._i.value;
    }
}