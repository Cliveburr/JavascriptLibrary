
namespace learninges6 {
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

    export interface IRouteData {
        html: string;
        ctr: IRouteControllerType;
    }

    export interface IRouteDataSignature {
        (data: IRouteData): void;
    }

    export interface IPreRouteSignature {
        (info: IRouteInfo): void;
    }

    export class Navigate {
        private _onRoute: (info: IRouteInfo, callBack: IRouteDataSignature) => void;
        private _currentCtr: IRouteController;
        private _preRoute: IPreRouteSignature;
        private _store: {[path: string]: IRouteData}; 

        constructor() {
            this._store = {};
        }

        public start(): void {
            window.addEventListener('popstate', this.popstate.bind(this));
            window.addEventListener('beforeunload', this.beforeunload.bind(this));
            this.to(window.location.pathname);
        }

        public onRoute(resolve: (info: IRouteInfo, callBack: IRouteDataSignature) => void): this {
            this._onRoute = resolve;
            return this;
        }

        public onPreRoute(preRoute: IPreRouteSignature): this {
            this._preRoute = preRoute;
            return this;
        }

        private beforeunload(ev: BeforeUnloadEvent): boolean {
            ev.
            return false;
        }

        private popstate(ev: PopStateEvent): void {
            console.log(ev);
        }

        public to(url: string, title?: string): void {
            // pega o statedata do ctr
            let sd = this._currentCtr ? this._currentCtr.statedata: {};
            // atualizar o state
            if (this._currentCtr)
                window.history.pushState(sd, title, url);
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
                    this._onRoute(info, (data: IRouteData) => {
                        this._store[window.location.pathname] = data;
                        this.processRoute(data, info)
                    });
            }
        }

        private processRoute(data: IRouteData, info: IRouteInfo): void {
            // fazer o call da route unload
            if (this._currentCtr && this._currentCtr.onUnload)
                this._currentCtr.onUnload();
            // gerar um ctr
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

    export class Program {
        public static navigate: Navigate;

        public static start(): void {
            Program.navigate = new Navigate();
            Program.navigate
                .onRoute(Program.onRoute)
                .start();
        }

        public static onRoute(info: IRouteInfo, callBack: IRouteDataSignature): void {
            let data = {
                html: `<div>Route:${info.paths.length > 0 ? info.paths.join('.'): 'none'}</div>`,
                ctr: HomeController
            }
            callBack(data);
        }
    }

    export class HomeController implements IRouteController {

    }

    export class BaseElement extends HTMLElement {
        public scope: any;
        public isScope: boolean;
        private _scopeCallBack: Array<(scope: any) => void>;

        protected scopeInitialize(): void {
            this.isScope = true;
            this._scopeCallBack = [];
        }

        public setScope(scope: any): void {
            if (!this.isScope)
                throw `Need to initialize the scope before set!`;
            this.scope = scope;
            this.callOnScope();
        }

        private callOnScope(): void {
            for (let cb of this._scopeCallBack) {
                cb(this.scope);
            }
        }

        public onScope(callBack: (scope: any) => void): void {
            if (this.isScope) {
                this._scopeCallBack.push(callBack);
                if (this.scope) {
                    callBack(this.scope);
                }
            }
            else {
                let parentScope = this.getClosedScope(this.parentElement);
                if (parentScope) {
                    parentScope.onScope(callBack);
                }
                else {
                    throw `None scope has found!`;
                }
            }
        }

        private getClosedScope(el: HTMLElement): BaseElement {
            if (el instanceof BaseElement && el.isScope) {
                return el;
            }
            else {
                if (el.parentElement) {
                    return this.getClosedScope(el.parentElement);
                }
                else {
                    return null;
                }
            }
        }
    }

    export class TestElement extends BaseElement {
        private static template = `<div>from inside</div>`;

        private _root: webcomponents.ShadowRootPolyfill;

        public createdCallback() {
            this._root = this.createShadowRoot();
            this.onScope((scope) => {
                this._root.innerHTML = scope ? scope.name : TestElement.template;
            });
        };
    }

    export class ContainerElement extends BaseElement {
        public createdCallback() {
            this.isScope = true;
            this.scopeInitialize();
            setTimeout(this.load.bind(this), 2000);
            setTimeout(this.load2.bind(this), 4000);
        }

        private load(): void {
            this.setScope({
                name: 'euuuuuu',
                address: 'uma rua qualquer',
                number: 1234,
                childs: [
                    { something: 1234 }
                ]
            });
        }

        private load2(): void {
            this.setScope({
                name: 'mudeiiiiiiiiiiii',
                address: 'uma rua qualquer',
                number: 1234,
                childs: [
                    { something: 1234 }
                ]
            });
        }
    }

    export class ViewElement extends BaseElement {
        public createdCallback() {
        }
    }
}

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        document.registerElement('container-element', learninges6.ContainerElement);
        document.registerElement('test-element', learninges6.TestElement);
        document.registerElement('nt-view', learninges6.ViewElement);

        learninges6.Program.start();
    }
}