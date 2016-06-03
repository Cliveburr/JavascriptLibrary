
module DynamicLoader {
    export interface IAjaxRequestHeader {
        header: string;
        value: string;
    }

    export interface IAjaxCallBack {
        (success: boolean, data: string): void;
    }

    export var items: Array<Item> = [];
    var ritem = 0;

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
        var script, head = document.head;

        script = document.createElement("script");
        script.async = true;
        script.src = url + '?v=' + ritem.toString();
        ritem++;

        script.onload = script.onreadystatechange = function (_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;

                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }

                script = null;

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

        head.insertBefore(script, head.firstChild);
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
            link.onload = null;
            link = null;
            callBack(true, null);
        };

        link.onerror = () => {
            callBack(false, 'Error loading script: ' + url);
        };

        link.href = url + '?v=' + ritem.toString();
        ritem++;

        if (isNew)
            document.head.insertBefore(link, document.head.firstChild);
    }

    function findStyle(url: string): HTMLLinkElement {
        let sts = document.head.getElementsByTagName('link');
        for (let s = 0, link: HTMLLinkElement; link = sts.item(s); s++) {
            if (link['__url__'] === url) {
                //link.parentNode.removeChild(link);
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

    function doGetHtml(item: Item): void {
        ajax(item.url + '?v=' + ritem.toString(), '', 'GET', [{
            header: 'Content-type', value: 'text/html'
        }], item.riseUpdate.bind(item));
        ritem++;
    }

    export function getHtml(url: string, callBack: IAjaxCallBack): Item {
        var item = find(url);

        if (!item) {
            item = new Item(url, doGetHtml);
            items.push(item);
        }

        item.onUpdate(callBack);

        getItemPath((itemPath) => {
            itemPath.addItem(url);
        });

        return item;
    }

    function doGetScript(item: Item): void {
        innerGetScript(item.url, item.riseUpdate.bind(item));
    }

    export function getScript(url: string, callBack?: IAjaxCallBack): Item {
        var item = find(url);

        if (!item) {
            item = new Item(url, doGetScript);
            items.push(item);
        }

        if (callBack)
            item.onUpdate(callBack);

        getItemPath((itemPath) => {
            itemPath.addItem(url);
        });

        return item;
    }

    function doGetStyle(item: Item): void {
        innerGetStyle(item.url, item.riseUpdate.bind(item));
    }

    export function getStyle(url: string, callBack?: IAjaxCallBack): Item {
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

    export class Item {
        private _callers: Array<IAjaxCallBack>;

        constructor(
            public url: string,
            private _doUpdate: (item: Item) => void) {
            this._callers = [];
        }

        public update(): void {
            setTimeout(this._doUpdate, 1, this);
        }

        public onUpdate(callBack: IAjaxCallBack): void {
            this._callers.push(callBack);
        }

        public riseUpdate(success: boolean, data: string): void {
            for (let i = 0, caller: IAjaxCallBack; caller = this._callers[i]; i++) {
                caller(success, data);
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