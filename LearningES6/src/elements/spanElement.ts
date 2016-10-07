import { BaseElement } from './baseElement';

export interface ISpanModel {
    text: string;
}

export class SpanElement extends BaseElement<ISpanModel> {
    private _s: HTMLSpanElement;

    public createdCallback(): void {
        let root = this.createShadowRoot();
        this._s = document.createElement('span');
        root.appendChild(this._s);
    }

    public attachedCallback(): void {
        this.checkScope();
    }

    public onScope(data: any): void {
        if (this.model = this.getModel())
            this.refresh();
    }

    private refresh(): void {
        this._s.innerText = this.model.text || '';
    }
}