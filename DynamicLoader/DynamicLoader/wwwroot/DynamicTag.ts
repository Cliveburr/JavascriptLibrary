
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
    export function renderHtml(el: HTMLElement, html: string): Tag {
        var tag = new TagHtml(el, html);
        el['__Tag__'] = tag;
        tag.render();
        return tag;
    }

    export function renderUrl(el: HTMLElement, url: string, ...scripts: string[]): Tag {
        var tag = new TagUrl(el, url, scripts);
        el['__Tag__'] = tag;
        tag.render();
        return tag;
    }

    export abstract class Tag {
        constructor(
            public el: HTMLElement) {
        }

        public abstract render(): void;
    }

    export class TagHtml extends Tag {
        constructor(
            el: HTMLElement,
            private _html: string) {
            super(el);
        }

        public render(): void {
            this.el.innerHTML = this._html;
        }
    }

    export class TagUrl extends Tag {
        private _scriptsReady: boolean;

        constructor(
            el: HTMLElement,
            private _url: string,
            private _scripts: string[]) {
            super(el);
        }

        public render(): void {
            DynamicLoader.getHtml(this._url, (success, data) => {
                if (success) {
                    this.el.innerHTML = data;
                    this.loadScripts();
                }
                else {
                    console.log('Error on getHtml! ' + data);
                }
            });
        }

        private loadScripts(): void {
            if (this._scriptsReady)
                return;

            for (let i = 0, s: string; s = this._scripts[i]; i++) {
                DynamicLoader.getScript(s);
            }

            this._scriptsReady = true;
        }
    }
}