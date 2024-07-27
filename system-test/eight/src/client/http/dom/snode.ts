import { SData } from "../data/sdata";
import { buildHtml } from "./build-html";
import { ISAttribute, ISEvent, ISNode, ISNodeTransport, ISProperty } from "./models";

export function isHTMLElement(node: Node): node is HTMLElement {
    return (!(node.nodeName == '#text' || node.nodeName == '#comment'));
}

window.uid ||= 0;

export class SNode {

    public uid: number;
    public version: number;
    public tag?: string;
    public attr: SAttribute;
    public childs: SNodeChilds;
    public events: SEvent;
    public props: SProperty;
    public content?: SContent;
    public code?: any;
    public data?: SData;
    public context?: SNode;
    public parent?: SNode;

    private constructor(
    ) {
        this.uid = window.uid++;
        this.version = 0;
        this.attr = new SAttribute(this);
        this.childs = new SNodeChilds(this);
        this.events = new SEvent(this);
        this.props = new SProperty(this);
    }

    public static createBody(): SNode {
        const sbody = new SNode();
        sbody.tag = 'body';
        return sbody;
    }

    public static async create(snode?: ISNode, ctx?: SNode): Promise<SNode> {
        const newSnode = new SNode();
        newSnode.context = ctx;
        if (snode) {
            await newSnode.applyStruct(snode);
        }
        return newSnode;
    }

    private async applyStruct(snode: ISNode): Promise<void> {
        for (const trans of <ISNodeTransport[]>['tag']) {
            this[trans] = snode[trans];
        }
        if (snode.content) {
            this.content = new SContent(this, snode.content);
        }
        if (snode.attr) {
            await this.attr.set(snode.attr);
        }
        if (snode.events) {
            this.events.push(snode.events);
        }
        if (snode.childs) {
            await this.childs.set(snode.childs, this.context);
        }
        if (snode.code) {
            await this.createCode(snode.code, snode.data);
            if (this.code['init']) {
                await Promise.resolve(this.code.init());
            }
        }
    }

    private async createCode(code: any, data?: any): Promise<void> {
        const args: any[] = [];
        let html: string | undefined;
        if (code.injector) {
            for (const dep of code.injector) {
                switch (dep) {
                    case 'snode': args.push(this); break;
                    case 'data': args.push(data); break;
                    case 'html': {
                        html = await this.getHtml(code);
                        break;
                    }
                }
            }
        }
        this.code = new code(...args);
        this.data = new SData(this.code);
        if (html) {
            const childs = buildHtml(html);
            await this.childs.set(childs, this);
        }
    }

    private async getHtml(code: any): Promise<string> {
        for (const mod in window.cache) {
            const exp = window.cache[mod];
            for (const key in exp) {    
                if (exp[key] === code) {
                    const file = mod.replace('.js', '.html');
                    return require(file);
                }
            }
        }
        throw 'Internal error!';
    }

    public async update(): Promise<void> {
        await window.sdom!.sync(this);
    }

    public release(): void {

    }

    public toString(): string {
        return `{ uid: ${this.uid}, tag: ${this.tag} }`;
    }

    public before(): SNode | undefined {
        if (this.parent) {
            const index = this.parent.childs.list.indexOf(this);
            return this.parent.childs.list[index - 1];
        }
        return undefined;
    }

    public next(): SNode | undefined {
        if (this.parent) {
            const index = this.parent.childs.list.indexOf(this);
            return this.parent.childs.list[index + 1];
        }
        return undefined;
    }

    public getDataContext(): SData | undefined {
        return this.context ?
        this.context.data :
        this.data
    }

    public setContent(content: string): void {
        if (this.content) {
            this.content.set(content);
        }
        else {
            this.content = new SContent(this, content);
            this.update();
        }
    }
}

export class SNodeChilds implements Iterable<SNode> {
    
    public list: SNode[];

    public constructor(
        public host: SNode
    ) {
        this.list = [];
    }

    [Symbol.iterator](): Iterator<SNode, any, undefined> {
        return this.list.values();
    }

    public get length(): number {
        return this.list.length;
    }

    public get(index: number): SNode | undefined {
        return this.list[index];
    }

    public last(): SNode | undefined {
        return this.list.last();
    }

    public async set(nodes: Array<SNode | ISNode>, ctx?: SNode): Promise<void> {
        this.list = [];
        await this.inner_push(nodes, ctx);
        await this.host.update();
    }
    
    public async push(nodes: Array<SNode | ISNode>, ctx?: SNode): Promise<void> {
        await this.inner_push(nodes, ctx);
        await this.host.update();
    }

    private async inner_push(nodes: Array<SNode | ISNode>, ctx?: SNode): Promise<void> {
        const newChilds: SNode[] = []
        for (const node of nodes) {
            if (node instanceof SNode) {
                node.parent = this.host;
                newChilds.push(node);
            }
            else {
                if (node.tag) {
                    const provide = await window.sdom!.tagProvider.get(node.tag);
                    if (provide) {
                        node.code = provide;
                    }
                }
                const snode = await SNode.create(node, ctx);
                snode.parent = this.host;
                newChilds.push(snode);
            }
        }
        this.list.push(...newChilds);
    }

    public async shift(): Promise<SNode | undefined> {
        const snode = this.list.shift();
        await this.host.update();
        return snode;
    }
}

export class SAttribute implements Iterable<ISAttribute> {

    public list: ISAttribute[];

    public constructor(
        public host: SNode
    ) {
        this.list = [];
    }

    [Symbol.iterator](): Iterator<ISAttribute, any, undefined> {
        return this.list.values();
    }

    public get length(): number {
        return this.list.length;
    }

    public get(index: number): ISAttribute | undefined {
        return this.list[index];
    }

    public async set(attrs: Array<ISAttribute>): Promise<void> {
        this.list = [];
        await this.inner_push(attrs);
        await this.host.update();
    }
    
    public async push(attrs: Array<ISAttribute>): Promise<void> {
        await this.inner_push(attrs);
        await this.host.update();
    }

    private async inner_push(attrs: Array<ISAttribute>): Promise<void> {
        const newsAttrs: ISAttribute[] = [];
        for (const attr of attrs) {
            const provide = await window.sdom!.attrProvider.get(attr.name);
            if (provide) {
                const newAttr = provide.build(this.host, attr);
                if (newAttr) {
                    newsAttrs.push(newAttr);
                }
            }
            else {
                newsAttrs.push(attr);
            }
        }
        this.list.push(...newsAttrs);
    }
}

export class SEvent implements Iterable<ISEvent> {

    private list: ISEvent[];

    public constructor(
        public host: SNode
    ) {
        this.list = [];
    }

    [Symbol.iterator](): Iterator<ISEvent, any, undefined> {
        return this.list.values();
    }

    public get length(): number {
        return this.list.length;
    }

    public get(index: number): ISEvent | undefined {
        return this.list[index];
    }

    // public set(...attrs: Array<ISAttribute>): void {
    //     this.list = [];
    //     window.sdom!.actions.attrClean(this.host);
    //     this.push(...attrs);
    // }
    
    public push(events: Array<ISEvent>): void {
        this.list.push(...events);
        this.host.update();
    }
}

export class SContent {

    public parts: Array<string | { ns: string }>;

    public constructor(
        public host: SNode,
        public rawContent: string
    ) {
        this.parts = this.buildParts();
    }

    private buildParts(): Array<string | { ns: string }> {
        const rt: Array<string | { ns: string }> = [];
        const dynamic = /\{\{(.*)\}\}/mg;
        let index = 0;
        let dyn: RegExpExecArray | null;
        const data = this.host.getDataContext();
        while (dyn = dynamic.exec(this.rawContent)) {
            if (dyn.index > index) {
                rt.push(this.rawContent.substr(index, dyn.index - index));
            }
            const ns = dyn[1]!
            rt.push({ ns });
            if (data) {
                data.subs.push({ func: this.host.update, this: this.host, ns });
            }
            index = dyn.index + dyn[0]!.length;
        }
        if (this.rawContent.length > index) {
            rt.push(this.rawContent.substr(index, this.rawContent.length - index));
        }
        return rt;
    }

    public get(): string {
        let rt = '';
        for (const part of this.parts) {
            if (typeof part == 'object') {
                const data = this.host.getDataContext();
                if (data) {
                    rt += data.get(part.ns);
                }
            }
            else {
                rt += part;
            }
        }
        return rt;
    }

    public set(value: string): void {
        this.rawContent = value;
        this.parts = this.buildParts();
        this.host.update();
    }
}

export class SProperty {

    private list: ISProperty[];

    public constructor(
        public host: SNode
    ) {
        this.list = [];
    }

    [Symbol.iterator](): Iterator<ISProperty, any, undefined> {
        return this.list.values();
    }

    public get length(): number {
        return this.list.length;
    }

    public get(index: number): ISProperty | undefined {
        return this.list[index];
    }

    public set(name: string, value: any): void {
        const found = this.list
            .find(l => l.name == name);
        if (found) {
            found.value = value;
        }
        else {
            this.list.push({ name, value });
        }
        this.host.update();
    }
}