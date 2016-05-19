
module DynamicLoader {
    export interface IAjaxRequestHeader {
        header: string;
        value: string;
    }

    export interface IAjaxCallBack {
        (success: boolean, data: string): void;
    }

    export function ajax(url: string, data: any, method: string, headers: IAjaxRequestHeader[], callBack: IAjaxCallBack): void {
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

    export function getScript(name: string, callBack: (err: string) => void): void {
        var script, head = document.head;

        script = document.createElement("script");
        script.async = true;
        script.src = name;

        script.onload = script.onreadystatechange = function (_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;

                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }

                script = null;

                if (isAbort)
                    callBack('Error loading script: ' + name);
                else {
                    callBack(null);
                }
            }
        };

        script.onerror = () => {
            callBack('Error loading script: ' + name);
        };

        head.insertBefore(script, head.firstChild);
    }

    export var items: Array<Item> = [];

    export function find(url: string): Item {
        for (let i = 0, item: Item; item = items[i]; i++) {
            if (item.url == url)
                return item;
        }
        return null;
    }

    function doGetHtml(item: Item): void {
        ajax(item.url, '', 'GET', [{
            header: 'Content-type', value: 'text/html'
        }], item.riseUpdate);
    }

    export function getHtml(url: string, callBack: IAjaxCallBack): Item {
        var item = find(url);

        if (!item) {
            item = new Item(url, doGetHtml);
            items.push(item);
        }

        item.onUpdate(callBack);
        item.update();

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
            setInterval(this._doUpdate, 1, this);
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
}