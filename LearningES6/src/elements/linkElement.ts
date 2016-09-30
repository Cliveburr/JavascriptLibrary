import { IOnScope } from '../binding/scope';

export interface IOnClick {
    (el: LinkElement, ev: MouseEvent): void;
}

export class LinkElement extends HTMLElement implements IOnScope {
    public get url(): string { return this._url; }

    private _root: webcomponents.ShadowRootPolyfill;
    private _a: HTMLAnchorElement;
    private _url: string;

    public createdCallback() {
        let ine = this.innerHTML;
        this.innerHTML = '';

        this._root = this.createShadowRoot();
        this._a = document.createElement('a');
        this._a.addEventListener('click', this.a_onClick.bind(this));
        this._root.appendChild(this._a);

        let textAttr = this.attributes.getNamedItem('text');
        if (!textAttr) {
            this._a.innerText = ine;
            this._a.href = this._url = '/';
        }
    }

    private a_onClick(ev: MouseEvent): void {
        let typeAttr = this.attributes.getNamedItem('type');
        LinkManager.callOnClick(this, ev, typeAttr ? typeAttr.value: undefined);
        ev.preventDefault();
    }

    public onScope(data: any): void {
        let textAttr = this.attributes.getNamedItem('text');
        if (data) {
            this._a.innerText = data[textAttr.value];
            this._a.href = this._url = '/' + data[textAttr.value];
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