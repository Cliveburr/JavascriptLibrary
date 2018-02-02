import { ItemType } from './itemtype';
import { ILoader, IToken, Item, ItemState } from './iloader';
import { Watch, AllWatch, Watcher } from '../core/watch';
import { HashGuard } from '../helpers/hash-guard';
import { ajax, getStyle, urlResolve } from '../helpers/http';

export class BrowserLoader implements ILoader {

    public tokenForController(script: string): IToken {
        return new ControllerToken(script);
    }
}

class ControllerToken implements IToken {

    private unsubs: Watcher<any>[];

    public items: Item[];
    public onload = new Watch<{ token: IToken, item: Item }>();

    public constructor(
        script: string
    ) {
        this.items = [ItemServe.getControllerItem(script)];
        this.unsubs = [];
    }

    public load(): void {
        let ctr = this.items[0] as ControllerItem;
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

    private oncontrollerdata(value: Item): void {
        if (value.state != ItemState.Ready) {
            return;
        }

        for (let unsub of this.unsubs) {
            unsub.unsub();
        }
        this.unsubs = [];

        let defaultClass = value.data.default;
        let newItems: Item[] = [];

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

    private onItemStateChange(): void {
        let allReady = this.items
            .filter(i => i.state != ItemState.Ready)
            .length == 0;

        if (allReady) {
            this.onload.set();
        }
    }
}

class ItemServe {
    private static items: { [url: string]: Item } = {};

    private static getOrCreate(url: string, obj: any): Item {
        if (ItemServe.items[url]) {
            return ItemServe.items[url];
        }
        else {
            return ItemServe.items[url] = new obj(url);
        }
    }

    public static getControllerItem(url: string): ControllerItem {
        return ItemServe.getOrCreate(url, ControllerItem) as ControllerItem;
    }

    public static getHtmlItem(url: string): HtmlItem {
        return ItemServe.getOrCreate(url, HtmlItem) as HtmlItem;
    }

    public static getCssItem(url: string): CssItem {
        return ItemServe.getOrCreate(url, CssItem) as CssItem;
    }
}

interface LoaderKeyBack {
    (load: any): void;
}

(<any>window).loaderKey = new HashGuard<LoaderKeyBack>(7);

class ControllerItem extends Item {

    public constructor(
        public url: string
    ) {
        super(url);
    }

    public get type(): ItemType {
        return ItemType.Controller;
    }

    public update(): void {
        if (!this.canUpdate()) {
            return;
        }
        this.setUpdate();

        let loaderKey = (<any>window).loaderKey as HashGuard<LoaderKeyBack>;

        let hash = loaderKey.aset((load) => {
            loaderKey.delete(hash);
            this.data = load;
            this.setReady();
        });

        let script = document.createElement("script");
        script.type = 'module';
        script.innerHTML = `import * as __load from '.${this.url}';
window.loaderKey.get('${hash}')(__load);`;
        
        script.onerror = (ev: ErrorEvent) => {
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

    public constructor(
        public url: string
    ) {
        super(url);
    }

    public get type(): ItemType {
        return ItemType.Html;
    }

    public update(): void {
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

    public constructor(
        public url: string
    ) {
        super(url);
    }

    public get type(): ItemType {
        return ItemType.CSS;
    }

    public update(): void {
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