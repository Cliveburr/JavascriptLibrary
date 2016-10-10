import { BaseElement } from './baseElement';

export interface ILinkModel {
    text: string;
    url: string;
}

export interface IOnClick {
    (el: LinkElement, ev: MouseEvent): void;
}

export class LinkElement extends BaseElement<ILinkModel> {
    private _a: HTMLAnchorElement;

    public createdCallback() {
        let ine = this.innerHTML;
        this.innerHTML = '';

        let root = this.createShadowRoot();
        this._a = document.createElement('a');
        this._a.addEventListener('click', this.a_onClick.bind(this));
        root.appendChild(this._a);
    }

    public attachedCallback(): void {
        this.checkScope();
    }

    public get href(): string { return this._a.href; }

    private a_onClick(ev: MouseEvent): void {
        let typeAttr = this.attributes.getNamedItem('type');
        LinkManager.callOnClick(this, ev, typeAttr ? typeAttr.value: undefined);
        ev.preventDefault();
    }

    public onScope(data: any): void {
        if (this.model = this.getModel()) {
            this._a.innerText = this.model.text || '';
            this._a.href = this.model.url;
        }
    }
}

export class LinkManager {
    private static _onClicks: { [type: string]: Array<IOnClick> } = {};

    public static callOnClick(el: LinkElement, ev: MouseEvent, type?: string): void {
        type = type || 'default';
        for (let onClick of LinkManager._onClicks[type]) {
            onClick(el, ev);
        }
    }

    public static setOnClick(onClick: IOnClick, type?: string): void {
        type = type || 'default';
        if (!LinkManager._onClicks[type])
            LinkManager._onClicks[type] = [];
        LinkManager._onClicks[type].push(onClick);
    }
}