import { LinkElement, LinkManager } from '../elements/linkElement';

export interface IRouteController {
    statedata?: any;
    onLoad?: (statedata: any) => void;
    onUnload?: Function;
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
        this.to(el.url);
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
        if (this._currentCtr)
            window.history.replaceState({url, title}, title, url);
        this.load(url, title);
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
        // fazer o call da route unload
        if (this._currentCtr && this._currentCtr.onUnload)
            this._currentCtr.onUnload();
        // gerar um ctr
        if (!data.ctr)
            throw 'Route controller not found!';
        this._currentCtr = new data.ctr();
        // fazer o call da route load
        if (this._currentCtr && this._currentCtr.onLoad)
            this._currentCtr.onLoad({});
        // realizar o render 
        this.render(data.html)
    }        

    private render(html: string): void {
        let view = document.getElementsByTagName('nt-view');
        if (view.length > 0) {
            view.item(0).innerHTML = html;
        }
    }
}