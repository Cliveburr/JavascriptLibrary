import { LinkElement, LinkManager } from '../elements/linkElement';

export interface IRouteController {
    createdCallback?(): void;
    attachedCallback?(): void;
    detachedCallback?(): void;
}

export interface IRouteControllerType {
    new (): IRouteController;
}    

export interface IRouteInfo {
    url: string;
    title?: string;
    href: string;
    paths: string[];
    query: string;
}

export interface IPreRoute {
    (info: IRouteInfo): void;
}

export interface IRouteData {
    html: string;
    ctr: IRouteControllerType;
    htmlState: Array<Node>;
    ctrState: any;
}

export interface IOnRoute {
    (info: IRouteInfo): Promise<IRouteData>;
}

export class Navigate {
    private static _instance: Navigate;
    private _onRoute: IOnRoute;
    private _currentCtr: IRouteController;
    private _preRoute: IPreRoute;
    private _store: {[path: string]: IRouteData}; 

    private constructor() {
        this._store = {};
        LinkManager.setOnClick(this.link_onClick.bind(this));
        setTimeout(this.start.bind(this), 1);
    }

    public static get instance(): Navigate {
        if (!Navigate._instance) {
            Navigate._instance = new Navigate();
        }
        return Navigate._instance;
    } 

    private link_onClick(el: LinkElement, ev: MouseEvent): void {
        this.to(el.href);
    }

    private start(): void {
        window.addEventListener('popstate', this.popstate.bind(this));
        this.to(window.location.pathname);
    }

    public onRoute(resolve: IOnRoute): this {
        this._onRoute = resolve;
        return this;
    }

    public onPreRoute(preRoute: IPreRoute): this {
        this._preRoute = preRoute;
        return this;
    }

    private popstate(ev: PopStateEvent): void {
        this.load(ev.state.url, ev.state.title);
    }

    public to(url: string, title?: string): void {
        // atualizar o state
        if (this._currentCtr) {
            this.getState();
            window.history.pushState({url, title}, title, url);
        }
        this.load(url, title);
    }

    private getState(): void {
        let store = this._store[window.location.pathname];
        let view = document.getElementsByTagName('nt-view');
        if (view.length > 0) {
            store.htmlState = [];
            for (let i = 0; i < view.item(0).childNodes.length; i++) {
                store.htmlState.push(view.item(0).childNodes.item(i));
            }
        }
        store.ctrState = this._currentCtr;
    }

    private async load(url: string, title?: string): Promise<void> {
        // gera o info
        let info = {
            url: url,
            title: title,
            href: window.location.href,
            paths: window.location.pathname.split('/').filter(p => p !== ''),
            query: window.location.search
        };            
        // fazer o call pre route
        if (this._preRoute)
            this._preRoute(info);
        // checar se a o path já é conhecido
        if (this._store[window.location.pathname]) {
            this.processRoute(this._store[window.location.pathname], info);
        }
        else {
            // se não for conhecido
            // chamar o onroute para buscar o content e diversos loads
            let data = await this._onRoute(info);

            this._store[window.location.pathname] = data;
            this.processRoute(data, info)
        }
    }

    private processRoute(data: IRouteData, info: IRouteInfo): void {
        if (!data.ctr)
            throw 'Route controller not found!';
        // fazer o call da route unload
        if (this._currentCtr && this._currentCtr.detachedCallback)
            this._currentCtr.detachedCallback();
        if (data.ctrState) {
            this._currentCtr = data.ctrState;
            this.setState(data.htmlState);
        }
        else {
            this._currentCtr = new data.ctr();
            this.render(data.html);
            if (this._currentCtr && this._currentCtr.createdCallback)
                this._currentCtr.createdCallback();
        }
        if (this._currentCtr && this._currentCtr.attachedCallback)
            this._currentCtr.attachedCallback();
    }        

    private render(html: string): void {
        let view = document.getElementsByTagName('nt-view');
        if (view.length > 0) {
            view.item(0).innerHTML = html;
        }
    }

    private setState(childs: Array<Node>): void {
        let view = document.getElementsByTagName('nt-view');
        if (view.length > 0) {
            view.item(0).innerHTML = '';
            for (let child of childs) {
                view.item(0).appendChild(child);
            }
        }
    }
}