import { BaseElement } from './baseElement';

export interface IButtonModel {
    text: string;
    onclick: (model: IButtonModel, button: ButtonElement, ev: MouseEvent) => void;
}

export class ButtonElement extends BaseElement<IButtonModel> {
    private _i: HTMLInputElement;

    public createdCallback() {
        let root = this.createShadowRoot();
        this._i = document.createElement('input');
        this._i.type = 'button';
        this._i.onclick = this._i_onclick.bind(this);
        root.appendChild(this._i);
    }

    public onScope(data: any): void {
        if (this.model = this.getModel()) {
            this._i.value = this.model.text;
        }
    }

    private _i_onclick(ev: MouseEvent): void {
        this.model.onclick(this.model, this, ev);
    }
}