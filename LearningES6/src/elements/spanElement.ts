import { BaseElement } from './baseElement';
import { IObserver } from '../system/observer';

export interface ISpanModel {
    text: string | IObserver<string>;
    onclick?: (model: ISpanModel, span: SpanElement, ev: MouseEvent) => void;
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
        if (this.isObserver(this.model.text)) {
            this.model.text.on((v) => this._s.innerText = v || '');
            this._s.innerText = this.model.text() || '';
        }
        else {
            this._s.innerText = this.model.text || '';
        }
        if (this.model.onclick)
            this._s.onclick = this._s_onclick.bind(this);
    }

    private _s_onclick(ev: MouseEvent): void {
        this.model.onclick(this.model, this, ev);
    }
}