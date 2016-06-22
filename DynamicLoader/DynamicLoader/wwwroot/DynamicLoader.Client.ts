
module DynamicLoader {
    export interface IAjaxRequestHeader {
        header: string;
        value: string;
    }

    export interface IAjaxCallBack {
        (success: boolean, data: string): void;
    }

    export interface IItemCallBack {
        (sender: Item, success: boolean, data: string): void;
    }

    export interface ITokenCallBack {
        (sender: Token): void;
    }

    export interface TokenItem {
        item: Item;
        success?: boolean;
        data?: string;
    }

    export var items: Array<Item> = [];
    var ritem = 0;
    var itemIndex = 0;

    function ajax(url: string, data: any, method: string, headers: IAjaxRequestHeader[], callBack: IAjaxCallBack): void {
        var client = new XMLHttpRequest();

        var statechange = (ev): void => {
            if (client.readyState === client.DONE) {
                if (client.status === 200) {
                    callBack(true, client.responseText);
                } else {
                    callBack(false, client.statusText);
                }
            }
        };

        var onerror = (): void => {
            callBack(false, client.statusText);
        }

        client.onreadystatechange = statechange;
        client.onerror = onerror;
        client.open(method, url, true);

        if (headers) {
            headers.forEach((head) => {
                client.setRequestHeader(head.header, head.value);
            });
        }

        client.send(data);
    }

    function innerGetScript(url: string, callBack: IAjaxCallBack): void {
        let script: any = findScript(url);
        let isNew = false;

        if (!script) {
            script = document.createElement("script");
            script.async = true;
            script['__url__'] = url;
            isNew = true;
        }

        script.onload = script.onreadystatechange = function (_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script = script.onload = script.onreadystatechange = null;

                if (isAbort)
                    callBack(false, 'Error loading script: ' + url);
                else {
                    callBack(true, null);
                }
            }
        };

        script.onerror = () => {
            callBack(false, 'Error loading script: ' + url);
        };

        script.src = url + '?v=' + ritem.toString();
        ritem++;

        if (isNew)
            document.head.appendChild(script);
    }

    function findScript(url: string): HTMLScriptElement {
        let sts = document.head.getElementsByTagName('script');
        for (let s = 0, script: HTMLScriptElement; script = sts.item(s); s++) {
            if (script['__url__'] === url) {
                return script;
            }
        }
        return null;
    }

    function innerGetStyle(url: string, callBack: IAjaxCallBack): void {
        let link = findStyle(url);
        let isNew = false;

        if (!link) {
            link = document.createElement("link");
            link.rel = 'stylesheet';
            link['__url__'] = url;
            isNew = true;
        }

        link.onload = (ev: Event) => {
            link.onload = link = null;
            callBack(true, null);
        };

        link.onerror = () => {
            callBack(false, 'Error loading script: ' + url);
        };

        link.href = url + '?v=' + ritem.toString();
        ritem++;

        if (isNew)
            document.head.appendChild(link);
    }

    function findStyle(url: string): HTMLLinkElement {
        let sts = document.head.getElementsByTagName('link');
        for (let s = 0, link: HTMLLinkElement; link = sts.item(s); s++) {
            if (link['__url__'] === url) {
                return link;
            }
        }
        return null;
    }

    export function find(url: string): Item {
        for (let i = 0, item: Item; item = items[i]; i++) {
            if (item.url == url)
                return item;
        }
        return null;
    }

    function findOrCreate(url: string, doGet: (item: Item) => void): Item {
        var item = find(url);

        if (!item) {
            item = new Item(url, doGet);
            items.push(item);
        }

        return item;
    }

    function doGetHtml(item: Item): void {
        ajax(item.url + '?v=' + ritem.toString(), '', 'GET', [{
            header: 'Content-type', value: 'text/html'
        }], item.riseUpdate.bind(item));
        ritem++;
    }

    export function getHtml(url: string, callBack: IItemCallBack): Item {
        var item = find(url);

        if (!item) {
            item = new Item(url, doGetHtml);
            items.push(item);
        }

        if (callBack)
            item.onUpdate(callBack);

        getItemPath((itemPath) => {
            itemPath.addItem(url);
        });

        return item;
    }

    function doGetScript(item: Item): void {
        innerGetScript(item.url, item.riseUpdate.bind(item));
    }

    export function getScript(url: string, callBack?: IItemCallBack): Item {
        var item = findOrCreate(url, doGetScript);

        if (callBack)
            item.onUpdate(callBack);

        if (item.ready) {
            callBack(item, true, item.data);
        }
        else {
            getItemPath((itemPath) => {
                itemPath.addItem(url);
            });
        }

        return item;
    }

    function doGetStyle(item: Item): void {
        innerGetStyle(item.url, item.riseUpdate.bind(item));
    }

    export function getStyle(url: string, callBack?: IItemCallBack): Item {
        var item = find(url);

        if (!item) {
            item = new Item(url, doGetStyle);
            items.push(item);
        }

        if (callBack)
            item.onUpdate(callBack);

        getItemPath((itemPath) => {
            itemPath.addItem(url);
        });

        return item;
    }

    export class Token {
        public items: Array<TokenItem>;

        private _ready: boolean;
        private _callBack: ITokenCallBack;

        constructor() {
            this.items = [];
            this._ready = false;
        }

        public getHtml(url: string): this {
            var item = findOrCreate(url, doGetHtml);
            this.items.push({
                item: item
            });
            return this;
        }

        public getScript(urls: string[]): this {
            if (urls) {
                for (let i = 0, url: string; url = urls[i]; i++) {
                    let item = findOrCreate(url, doGetScript);
                    this.items.push({
                        item: item
                    });
                }
            }
            return this;
        }

        public getStyle(urls: string[]): this {
            if (urls) {
                for (let i = 0, url: string; url = urls[i]; i++) {
                    let item = findOrCreate(url, doGetStyle);
                    this.items.push({
                        item: item
                    });
                }
            }
            return this;
        }

        public on(callBack: ITokenCallBack): this {
            if (callBack) {
                this._callBack = callBack;
                for (let f = 0, i: TokenItem; i = this.items[f]; f++) {
                    i.item.onUpdate(this.onCallBack.bind(this));
                }
            }

            for (let f = 0, i: TokenItem; i = this.items[f]; f++) {
                if (i.item.ready) {
                    this.onCallBack(i.item, true, i.item.data);
                }
                else {
                    getItemPath((itemPath) => {
                        itemPath.addItem(i.item.url);
                    });
                }
            }
            return this;
        }

        private onCallBack(sender: Item, success: boolean, data: string): void {
            let item = this.findItem(sender.index);
            item.success = success;
            item.data = data;
            if (this._ready) {
                this._callBack(this);
            }
            else {
                for (let f = 0, i: TokenItem; i = this.items[f]; f++) {
                    if (!i.item.ready)
                        return;
                }
                this._ready = true;
                this._callBack(this);
            }
        }

        private findItem(index: number): TokenItem {
            for (let f = 0, i: TokenItem; i = this.items[f]; f++) {
                if (i.item.index === index)
                    return i;
            }
            return null;
        }
    }

    export class Item {
        private _index: number;
        private _callers: Array<IItemCallBack>;
        private _ready: boolean;
        private _data: string;

        public get index(): number { return this._index; }
        public get ready(): boolean { return this._ready; }
        public get data(): string { return this._data; }

        constructor(
            public url: string,
            private _doUpdate: (item: Item) => void) {
            this._index = itemIndex++;
            this._callers = [];
            this._ready = false;
        }

        public update(): void {
            setTimeout(this._doUpdate, 1, this);
        }

        public onUpdate(callBack: IItemCallBack): void {
            this._callers.push(callBack);
        }

        public riseUpdate(success: boolean, data: string): void {
            if (success) {
                this._data = data;
                this._ready = true;
            }

            for (let i = 0, caller: IItemCallBack; caller = this._callers[i]; i++) {
                caller(this, success, data);
            }
        }
    }

    class ItemPath implements NodeHttp.WebSocket.IPath {
        public index: number;
        private _conn: NodeHttp.WebSocket.Connection;

        public create(connection: NodeHttp.WebSocket.Connection): void {
            this._conn = connection;
        }

        public addItem(url: string): void {
            this._conn.send(this.index, 'addItem', url);
        }

        public refreshItem(url: string): void {
            var item = find(url);

            if (!item)
                console.log('Refresh item message wrong! Url: ' + url);

            item.update();
        }
    }
    
    NodeHttp.WebSocket.paths.push({ path: 'ItemPath', item: ItemPath });
    var _itemPath: ItemPath;
    var _itemPathCallbacks: Array<(itemPath: ItemPath) => void>;
    var _ws: NodeHttp.WebSocket.Connection;

    export function getItemPath(callBack: (itemPath: ItemPath) => void): void {
        if (_itemPath) {
            callBack(_itemPath);
        }
        else {
            if (_itemPathCallbacks) {
                _itemPathCallbacks.push(callBack);
            }
            else {
                _itemPathCallbacks = [callBack];
                var host = window.document.location.host.replace(/:.*/, '');
                _ws = NodeHttp.WebSocket.connect(host, 1337);
                _ws.ready(() => {
                    _itemPath = _ws.createPath<ItemPath>('ItemPath');
                    for (let i = 0, cb: (itemPath: ItemPath) => void; cb = _itemPathCallbacks[i]; i++) {
                        cb(_itemPath);
                    }
                });;
            }
        }
    }
}