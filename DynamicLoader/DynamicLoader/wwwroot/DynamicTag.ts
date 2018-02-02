
module DynamicTag2 {
    export abstract class Tag {
        public childs: TagCollection;
        public anchor: Node;

        constructor(
            public parent: Tag) {
            this.childs = new TagCollection(this);
        }

        public refresh(): void {
            this.getElement((cb) => {
                this.parent.render(this);
            });
        }

        protected abstract getElement(cb: (els: HTMLElement[]) => void): void;

        protected abstract render(tag: Tag): void;

        public abstract getLastNode(): Node;

        public static childs(el: HTMLElement): HTMLElement[] {
            let tr: HTMLElement[] = [];
            for (let i = 0; i < el.childNodes.length; i++) {
                if (el.childNodes[i].nodeType == 1) {
                    tr.push(<HTMLElement>el.childNodes.item(i));
                }
            }
            return tr;
        }

        public static parse(html: string): HTMLElement[] {
            let p = document.createElement('div');
            p.innerHTML = html;
            return Tag.childs(p);
        }
    }

    export class TagDOM extends Tag {
        constructor(
            parent: Tag,
            private _el: HTMLElement) {
            super(parent);
        }

        protected getElement(cb: (els: HTMLElement[]) => void): void {
            cb([this._el]);
        }

        protected render(tag: Tag): void {

        }

        public getLastNode(): Node {
            return this._el.childNodes.item(this._el.childNodes.length - 1);
        }
    }

    export class TagHtml extends Tag {
        constructor(
            parent: Tag,
            private _html: string) {
            super(parent);
        }

        protected getElement(cb: (els: HTMLElement[]) => void): void {
            cb(Tag.parse(this._html));
        }

        protected render(tag: Tag): void {
            throw 'Static html can\'t render childs!';
        }

        public getLastNode(): Node {
            throw 'Static html can\'t has childs!';
        }
    }

    export class TagCollection {
        private _c: Array<Tag>;
        public get getChilds(): Array<Tag> { return this._c; }

        constructor(
            public tag: Tag) {
            this._c = [];
        }

        public push(tag: {
            html?: string,
            htmlUrl?: string,
            jsUrl?: string | string[],
            cssUrl?: string | string[]
        }): void {
            var a = this.tag.getLastNode();

            if (tag.html) {
                var nt = new TagHtml(this.tag, tag.html);
                nt.anchor = a;
                this._c.push(nt);
                nt.refresh();
            }
        }
    }
}

//var DOC = new DynamicTag.TagDOM(null, document.body);




module DynamicTag {
    var renderIndex = 0;

    export interface ITagProvider {
        test(tagName: string): boolean;
        define(tag: IDefinition): void;
    }

    export interface IDefinition {
        name?: string;
        htmlUrl?: string;
        scripts?: Array<string>;
        controller?: string;
        styles?: Array<string>;
    }

    export interface IController {
        onRender?(nodes: NodeList, render: (nodes: NodeList) => void): void;
        afterRender?(nodes: NodeList): void;
    }

    export interface IAnchorChild {
        index: number;
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

            if (this._ctr) {
                delete this._ctr;
            }

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

    class Provider {
        public tagProvider: ITagProvider;
        private _defs: Array<IDefinition>;

        constructor() {
            this._defs = [];
        }

        public findOrCreate(tagName: string): IDefinition {
            for (let i = 0, d: IDefinition; d = this._defs[i]; i++) {
                if (d.name === tagName) {
                    return d;
                }
            }
            let d: IDefinition = {
                name: tagName
            };
            provider.tagProvider.define(d);
            this._defs.push(d);
            return d;
        }
    }

    var provider = new Provider();

    export function setTagProvider(tagProvider: ITagProvider): void {
        provider.tagProvider = tagProvider;
    }

    function render(html: string): NodeList {
        let c = document.createElement('div');
        c.innerHTML = html;
        runChilds(c);
        return c.childNodes;
    }

    function runChilds(el: HTMLElement): void {
        let childs: Array<Node> = [];
        while (el.childNodes.length > 0) {
            childs.push(el.firstChild);
            el.removeChild(el.firstChild);
        }
        el.innerHTML = '';
        for (let i = 0, n: Node; n = childs[i]; i++) {
            let newN = run(n);
            el.appendChild(newN);
        }
    }

    function run(node: Node): Node {
        if (node.nodeType != 1)
            return node;

        var el = <HTMLElement>node;
        if (provider.tagProvider.test(el.tagName)) {
            let def = provider.findOrCreate(el.tagName);
            var ta = new Anchor(def);
            return ta.anchor;
        }
        else {
            runChilds(el);
            return node;
        }
    }

    //function parse(html: string): NodeList {
    //    let d = document.createElement('div');
    //    d.innerHTML = html;
    //    return d.childNodes;
    //}
}