import { ItemType } from '../index';
import { parseHtml } from '../helpers/http';
var VirtualActionType;
(function (VirtualActionType) {
    VirtualActionType[VirtualActionType["Insert"] = 1] = "Insert";
})(VirtualActionType || (VirtualActionType = {}));
export class Virtual {
    constructor(parent) {
        this.parent = parent;
        this.actions = [];
    }
    update() {
        DynamicEngine.performActions(this);
        this.actions = [];
        for (let children of this.childrens) {
            children.update();
        }
    }
    addChildren(virtual) {
        if (this.firstChild) {
            let lastChild = this.lastChildren();
            lastChild.next = virtual;
            virtual.back = lastChild;
        }
        else {
            this.firstChild = virtual;
        }
    }
    lastChildren() {
        if (this.firstChild) {
            return this.lastValidChildrenRe(this.firstChild);
        }
        return null;
    }
    lastValidChildrenRe(children) {
        if (children.next) {
            return this.lastValidChildrenRe(children.next);
        }
        else {
            return children;
        }
    }
}
export class Dynamic extends Virtual {
    constructor(app) {
        super(null);
        this.app = app;
    }
    get getNodes() {
        return null;
    }
    get generateNodes() {
        return null;
    }
}
export class Root extends Dynamic {
    constructor(app) {
        super(app);
    }
    bindToDom() {
        this.root = document.body;
    }
    load(script) {
        let token = this.token = this.app.loaderProvider.tokenForController(script);
        this.watcher = token.onload.sub(this.onload.bind(this));
        token.load();
    }
    async onload() {
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
    createContext() {
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
    createNodes() {
        let htmlItem = this.token.items
            .filter(i => i.type == ItemType.Html);
        if (htmlItem.length == 0) {
            return null;
        }
        return parseHtml(htmlItem[0].data);
    }
}
export class InnerTEXT extends Virtual {
    constructor(parent, textContent) {
        super(parent);
        this.textContent = textContent;
        this.actions.push({
            type: VirtualActionType.Insert,
            node: document.createTextNode(this.textContent)
        });
    }
}
export class DyElement extends Virtual {
    constructor(parent, element) {
        super(parent);
        this.element = element;
        this.actions.push({
            type: VirtualActionType.Insert,
            node: document.createElement(this.element.tagName)
        });
    }
}
export class DynamicEngine {
    static async resolveNodes(parent, nodes) {
        for (let node of nodes) {
            await this.resolveNodesChild(parent, node);
        }
    }
    static async resolveNodesChild(parent, node) {
        if (node.nodeType != Node.TEXT_NODE) {
            parent.addChildren(new InnerTEXT(parent, node.textContent));
            return;
        }
        if (node.nodeType != Node.ELEMENT_NODE) {
            return;
        }
        let el = node;
        let virtual = new DyElement(parent, el);
        parent.addChildren(virtual);
        for (let node of el.childNodes) {
            await this.resolveNodesChild(virtual, node);
        }
    }
    static performActions(virtual) {
        for (let action of virtual.actions) {
            switch (action.type) {
                case VirtualActionType.Insert:
                    this.perfomInsert(virtual, action);
                    break;
            }
        }
    }
    static perfomInsert(virtual, action) {
    }
}
//# sourceMappingURL=virtual.js.map