import { ItemType } from './itemtype';
import { Item, ItemState } from './iloader';
import { Watch } from '../core/watch';
import { HashGuard } from '../helpers/hash-guard';
import { ajax, getStyle, urlResolve } from '../helpers/http';
export class BrowserLoader {
    tokenForController(script) {
        return new ControllerToken(script);
    }
}
class ControllerToken {
    constructor(script) {
        this.onload = new Watch();
        this.items = [ItemServe.getControllerItem(script)];
        this.unsubs = [];
    }
    load() {
        let ctr = this.items[0];
        ctr.onstate.sub(this.oncontrollerdata.bind(this));
        if (ctr.state == ItemState.Initial) {
            ctr.update();
        }
        else if (ctr.state == ItemState.Ready) {
            for (let i = 1; i < this.items.length; i++) {
                this.unsubs.push(this.items[i].onstate.sub(this.onItemStateChange.bind(this)));
            }
            this.onItemStateChange();
        }
    }
    oncontrollerdata(value) {
        if (value.state != ItemState.Ready) {
            return;
        }
        for (let unsub of this.unsubs) {
            unsub.unsub();
        }
        this.unsubs = [];
        let defaultClass = value.data.default;
        let newItems = [];
        let templateUrl = defaultClass.templateUrl;
        if (templateUrl) {
            newItems.push(ItemServe.getHtmlItem(urlResolve(value.url, '/../', templateUrl)));
        }
        let styleUrls = defaultClass.styleUrls;
        if (styleUrls) {
            for (let style of styleUrls) {
                newItems.push(ItemServe.getCssItem(urlResolve(value.url, '/../', style)));
            }
        }
        this.items = [value].concat(newItems);
        for (let item of newItems) {
            this.unsubs.push(item.onstate.sub(this.onItemStateChange.bind(this)));
            if (item.state == ItemState.Initial) {
                item.update();
            }
        }
        this.onItemStateChange();
    }
    onItemStateChange() {
        let allReady = this.items
            .filter(i => i.state != ItemState.Ready)
            .length == 0;
        if (allReady) {
            this.onload.set();
        }
    }
}
class ItemServe {
    static getOrCreate(url, obj) {
        if (ItemServe.items[url]) {
            return ItemServe.items[url];
        }
        else {
            return ItemServe.items[url] = new obj(url);
        }
    }
    static getControllerItem(url) {
        return ItemServe.getOrCreate(url, ControllerItem);
    }
    static getHtmlItem(url) {
        return ItemServe.getOrCreate(url, HtmlItem);
    }
    static getCssItem(url) {
        return ItemServe.getOrCreate(url, CssItem);
    }
}
ItemServe.items = {};
window.loaderKey = new HashGuard(7);
class ControllerItem extends Item {
    constructor(url) {
        super(url);
        this.url = url;
    }
    get type() {
        return ItemType.Controller;
    }
    update() {
        if (!this.canUpdate()) {
            return;
        }
        this.setUpdate();
        let loaderKey = window.loaderKey;
        let hash = loaderKey.aset((load) => {
            loaderKey.delete(hash);
            this.data = load;
            this.setReady();
        });
        let script = document.createElement("script");
        script.type = 'module';
        script.innerHTML = `import * as __load from '.${this.url}';
window.loaderKey.get('${hash}')(__load);`;
        script.onerror = (ev) => {
            this.data = ev.error;
            console.error(ev.error);
            this.setError();
        };
        document.head
            .appendChild(script)
            .parentNode
            .removeChild(script);
    }
}
class HtmlItem extends Item {
    constructor(url) {
        super(url);
        this.url = url;
    }
    get type() {
        return ItemType.Html;
    }
    update() {
        if (!this.canUpdate()) {
            return;
        }
        this.setUpdate();
        ajax(this.url, '', 'GET', [{
                header: 'Content-type', value: 'text/html'
            }], (success, data) => {
            this.data = data;
            if (success) {
                this.setReady();
            }
            else {
                console.error(data);
                this.setError();
            }
        });
    }
}
class CssItem extends Item {
    constructor(url) {
        super(url);
        this.url = url;
    }
    get type() {
        return ItemType.CSS;
    }
    update() {
        if (!this.canUpdate()) {
            return;
        }
        this.setUpdate();
        getStyle(this.url, (success, data) => {
            if (success) {
                this.setReady();
            }
            else {
                console.error(data);
                this.setError();
            }
        });
    }
}
//# sourceMappingURL=browser-loader.js.map