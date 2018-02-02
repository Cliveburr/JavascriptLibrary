import { DynamicApp } from '../core/app';
import { IToken } from '../loader/iloader';
import { Watcher } from '../core/watch';
import { ItemType } from '../index';
import { parseHtml } from '../helpers/http';


interface VirtualAction {
    type: VirtualActionType;
    node?: Node;
}

enum VirtualActionType {
    Insert = 1
}

export abstract class Virtual {

    public childrens: Virtual[];
    public actions: VirtualAction[]

    public firstChild: this;
    public next: this;
    public back: this;

    public constructor(
        public parent: Virtual,
    ) {
        this.actions = [];
    }

    public update(): void {
        DynamicEngine.performActions(this);
        this.actions = [];
        for (let children of this.childrens) {
            children.update();
        }
    }

    public addChildren(virtual: this): void {
        if (this.firstChild) {
            let lastChild = this.lastChildren();
            lastChild.next = virtual;
            virtual.back = lastChild;
        }
        else {
            this.firstChild = virtual;
        }
    }

    public lastChildren(): this {
        if (this.firstChild) {
            return this.lastValidChildrenRe(this.firstChild);
        }
        return null;
    }

    private lastValidChildrenRe(children: this): this {
        if (children.next) {
            return this.lastValidChildrenRe(children.next);
        }
        else {
            return children;
        }
    }
}

export class Dynamic extends Virtual {

    public inShadow: boolean;
    public context: any;

    public constructor(
        protected app: DynamicApp
    ) {
        super(null);
    }

    protected get getNodes(): Node[] {
        return null;
    }

    protected get generateNodes(): Node[] {
        return null;
    }

    // public toShadowMode(): void {
    //     if (!this.inShadow) {
    //         this.inShadow = true;
    //         let container = document.createElement('div');
    //         if (this.element) {
    //             // remove from dom
    //             // put in container
    //         }
    //         this.element = container;
    //     }
    // }

    // public toLightMode(): void {
    //     if (this.inShadow) {
    //         this.inShadow = false;
    //         for (let node of this.element.childNodes) {
                
    //         }
    //     }
    // }
}

export class Root extends Dynamic {

    private watcher: Watcher<any>;

    public root: HTMLBodyElement;
    public token: IToken;

    public constructor(
        app: DynamicApp
    ) {
        super(app);
    }

    public bindToDom(): void {
        this.root = document.body as HTMLBodyElement;
    }

    public load(script: string): void {
        let token = this.token = this.app.loaderProvider.tokenForController(script);
        this.watcher = token.onload.sub(this.onload.bind(this));
        token.load();
    }

    private async onload(): Promise<void> {
        this.token.onload.unsub(this.watcher);
        delete this.watcher;

        this.createContext();

        let nodes = this.createNodes();
        if (nodes) {
            await DynamicEngine.resolveNodes(this, nodes);
        }

        this.update();

        //this.token.onload.sub(this.onreload.bind(this));  apenas para o modo live
    }

    // private onreload(): void {

    // }

    private createContext(): void {
        let ctrItem = this.token.items
            .filter(i => i.type == ItemType.Controller);
        if (ctrItem.length != 1) {
            throw 'Wrong items!';
        }

        let defaultClass = ctrItem[0].data.default;
        if (!defaultClass) {
            throw `Miss default export for "${ctrItem[0].url}"!`;
        }

        this.context = new defaultClass();
    }

    private createNodes(): NodeList {
        let htmlItem = this.token.items
            .filter(i => i.type == ItemType.Html);
        if (htmlItem.length == 0) {
            return null;
        }
        return parseHtml(htmlItem[0].data);
    }
}

export class InnerTEXT extends Virtual {

    public constructor(
        parent: Virtual,
        private textContent: string
    ) {
        super(parent);

        this.actions.push({
            type: VirtualActionType.Insert,
            node: document.createTextNode(this.textContent)
        });
    }
}

export class DyElement extends Virtual {

    public constructor(
        parent: Virtual,
        private element: Element
    ) {
        super(parent);

        this.actions.push({
            type: VirtualActionType.Insert,
            node: document.createElement(this.element.tagName)
        });
    }
}

export class DynamicEngine {

    public static async resolveNodes(parent: Virtual, nodes: NodeList): Promise<void> {
        for (let node of nodes) {
            await this.resolveNodesChild(parent, node);
        }
    }

    private static async resolveNodesChild(parent: Virtual, node: Node): Promise<void> {
        if (node.nodeType != Node.TEXT_NODE) {
            parent.addChildren(new InnerTEXT(parent, node.textContent));
            return;
        }

        if (node.nodeType != Node.ELEMENT_NODE) {
            return;
        }

        let el = node as Element;
        let virtual = new DyElement(parent, el);
        parent.addChildren(virtual);

        for (let node of el.childNodes) {
            await this.resolveNodesChild(virtual, node);
        }
    }

    public static performActions(virtual: Virtual): void {
        for (let action of virtual.actions) {
            switch (action.type) {
                case VirtualActionType.Insert: this.perfomInsert(virtual, action); break;
            }
        }
    }

    private static perfomInsert(virtual: Virtual, action: VirtualAction): void {

    }
}