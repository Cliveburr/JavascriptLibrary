
export interface ITaggerRootElement extends HTMLElement {
    __tagger__: Tagger;
}

export class Tagger {
    public static renderIndex: number = 0;

    private _el: ITaggerRootElement;
    private _tagProvider: TagProvider;

    constructor(el?: HTMLElement) {
        this._tagProvider = new TagProvider();
        this._el = el ?
            <ITaggerRootElement>el :
            <ITaggerRootElement>document.body;

        this._el.__tagger__ = this;

        if (this._el.__tagger__) {
            //TODO: need to dispose the old tagger controller
        }
    }

    public get tagProvider(): TagProvider {
        return this._tagProvider;
    }

    public run(): void {
        this._el.style.display = 'none';
        this.compileChilds(this._el);
        this._el.style.display = '';
    }

    private compileChilds(n: Node): void {
        for (var i = 0; i < n.childNodes.length; i++) {
            if (n.childNodes[i].nodeType == 1) {
                this.compile(n.childNodes[i]);
            }
        }
    }

    private compile(n: Node): void {
        let idAttr = n.attributes.getNamedItem('id');
        if (idAttr) {

        }

        let tag = this._tagProvider.get(n.localName)
            .then()
    }
}

export class TagProvider {
    private _defs: {[name: string]: ITagType};
    private _resols: ITagResolver[];

    constructor() {
        this._defs = {};
        this._resols = [];
    }

    public register(tag: ITagType): this {
        if (this._defs[tag.name]) {
            throw `Tag "${tag.name}" already registred!`;
        }
        this._defs[tag.name] = tag;
        return this;
    }

    public addResolver(resolver: ITagResolver): this {
        this._resols.push(resolver);
        return this;
    }

    public get(name: string): Promise<ITagType> {
        var have = this._defs[name];
        if (have) {
            return have;
        }
        else {
            for (let r of this._resols) {
                let a = new Promise<int>()
            }
        }
    }
}

export class Anchor {
    private _index: number;
    private _anchor: Text;
    private _def: IDefinition;
    private _childs: Array<Node>;
    private _token: DynamicLoader.Token;
    private _ctr: IController;

    public get index(): number { return this._index; }
    public get anchor(): Node { return this._anchor; }

    constructor(def: IDefinition) {
        this._index = renderIndex++;
        this._def = def;
        this.createAnchor();
    }

    private createAnchor(): void {
        this._anchor = document.createTextNode('');
        this._anchor['__Anchor__'] = this;
    }

    protected createLoader(): void {
        this._token = new DynamicLoader.Token()
            .getHtml(this._def.htmlUrl)
            .getScript(this._def.scripts)
            .getStyle(this._def.styles)
            .on(this.onLoad.bind(this));
    }

    private onLoad(sender: DynamicLoader.Token): void {
        let data: string;

        for (let f = 0, t: DynamicLoader.Item; t = sender.items[f]; f++) {
            if (t.error)
                throw 'Error loading url ' + t.url + '! Error: ' + t.error;

            if (t.data)
                data = t.data;
        }

        if (data) {
            this.doRender(data);
        }
    }

    public clear(): void {
        let pa = this._anchor.parentNode;

        if (this._childs) {
            for (let f = 0, n: Node; n = this._childs[f]; f++) {
                if (n['__Anchor__']) {
                    (<Anchor>n['__Anchor__']).clear(); //  destroy?
                }
                pa.removeChild(n);
            }
        }

        this._childs = [];
    }

    private doRender(data: string): void {
        let pa = <HTMLElement>this._anchor.parentNode;
        if (!pa) //TODO: need to remove this!!
            return;

        let ns = render(data);

        this.onRender(ns, (node) => {
            this.clear();

            let afel: Node = this._anchor.nextSibling;
            for (let b = node.length - 1; b >= 0; b--) {
                let n = node.item(b);
                n['__AnchorChild__'] = <IAnchorChild>{
                    index: this._index
                };
                if (n['__Anchor__']) {
                    (<Anchor>n['__Anchor__']).insertBefore(pa, afel);
                }
                else {
                    pa.insertBefore(n, afel);
                }
                afel = n;
                this._childs.unshift(n);
            }

            this.afterRender(node);
        });
    }

    public insertInto(el: HTMLElement): void {
        el.appendChild(this.anchor);
        this.createLoader();
    }

    public insertBefore(el: HTMLElement, refChild?: Node): void {
        el.insertBefore(this.anchor, refChild);
        this.createLoader();
    }

    public get controller(): IController {
        if (!this._ctr && this._def.controller) {
            let ctr = this.getObj(window, this._def.controller);
            if (ctr) {
                this._ctr = new ctr();
            }
        }
        return this._ctr;
    }

    private getObj(base: any, nameSpace: string): any {
        let names = nameSpace.split('.');
        if (names.length == 1) {
            return base[names[0]];
        }
        else {
            let name = names.splice(0, 1)[0];
            return this.getObj(base[name], names.join('.'));
        }
    }

    private onRender(ns: NodeList, callBack: (nodes: NodeList) => void): void {
        if (this.controller && this.controller.onRender) {
            this.controller.onRender(ns, callBack);
        }
        else {
            callBack(ns);
        }
    }

    private afterRender(ns: NodeList): void {
        if (this.controller && this.controller.afterRender) {
            this.controller.afterRender(ns);
        }
    }
}

export interface ITagResolver {
    (tag: string): ITagType;
}

export interface ITagType {
    name: string;
    new(): Tag;
}

export class Tag {

}