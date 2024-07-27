import { Provider } from "../providers/provider";
import { AttrResolver } from "../providers/attr/attr.provider";
//import { SActions } from "./actions";
import { IDomSyncContext, IDomSyncRequest, ISActionsExec } from "./models";
import { SNode } from "./snode";
import { Router } from "../router/router";

interface ICrossRef {
    snode: SNode,
    version: number,
    node?: Node
}

export class SDom {

    public body: SNode;
    private domsync?: IDomSyncContext;
    private refs: { [uid: number]: ICrossRef };

    public constructor(
        public attrProvider: Provider<AttrResolver>,
        public tagProvider: Provider<any>,
        public router: Router
    ) {
        this.refs = {};
        this.body = SNode.createBody();
        this.refs[this.body.uid] = { snode: this.body, node: document.body, version: 0 };
        this.prepareShadow();
    }

    private prepareShadow(): void {
        if (window.sdom) {
            delete window.sdom;
        }
        window.sdom = this;
    }

    public sync(snode: SNode): Promise<void> {
        return new Promise<void>((exe, rej) => {
            if (!this.refs[snode.uid]) {
                exe();
                return;
            }
            snode.version++;

            if (this.domsync) {
                clearTimeout(this.domsync.timeout);
                this.mergeSyncs({ snode });
            }
            else {
                this.domsync = {
                    snode: snode,
                    timeout: 0,
                    exes: [],
                    rejs: []
                }
            }
            this.domsync.timeout = setTimeout(this.runsync_inter.bind(this), 1);
            this.domsync.exes.push(exe);
            this.domsync.rejs.push(rej);
        });
    }

    private mergeSyncs(req: IDomSyncRequest): void {
        const syncNode = this.domsync!.snode;
        let reqNode = req.snode;
        if (!this.isAnyChild(syncNode, reqNode)) {
            this.domsync!.snode = req.snode;
        }
    }

    private isAnyChild(root: SNode, test: SNode): boolean {
        for (const child of root.childs) {
            if (child === test) {
                return true;
            }
        }
        if (root.parent) {
            return this.isAnyChild(root.parent, test);
        }
        return false;
    }

    private runsync_inter(): void {
        const ctx = this.domsync!;
        try {
            this.sync_snode(ctx.snode);

            for (const exe of ctx.exes) {
                exe();
            }
        }
        catch (err) {
            for (const rej of ctx.rejs) {
                rej(err);
            }
        }
        delete this.domsync;
    }

    private findValidHTMLParent(snode: SNode): { snode: SNode, baseEl: HTMLElement } | null {
        const ref = this.refs[snode.uid];
        if (ref?.node?.isHTMLElement()) {
            return { snode, baseEl: ref.node }
        }
        else {
            if (snode.parent) {
                return this.findValidHTMLParent(snode.parent);
            }
            else {
                return null;
            }
        }
    }

    private sync_snode(snode: SNode): void {

        const validHtml = this.findValidHTMLParent(snode);
        if (!validHtml) {
            throw 'Invalid sync over snode!';
        }

        const baseEl = validHtml.baseEl;
        snode = validHtml.snode;

        this.sync_compare(snode, baseEl);
    }

    private sync_childs(snode: SNode): void {

        const validHtml = this.findValidHTMLParent(snode);
        if (!validHtml) {
            throw 'Invalid sync over snode!';
        }

        const baseEl = validHtml.baseEl;
        snode = validHtml.snode;

        const sChilds = this.filterTagChils(snode, [])
            .map(c => { return { uid: c.uid, snode: c }});

        const dChilds: Array<{ uid: number, node: Node }> = [];
        if (baseEl.hasChildNodes()) {
            for (const childNode of baseEl.childNodes) {
                dChilds.push({ uid: childNode.uid, node: childNode });
            }
        }

        const toCompare: Array<{ snode: SNode, node: Node }> = [];
        const toInclude: Array<SNode> = [];
        for (const sChild of sChilds) {
            const dChild = dChilds
                .find(dc => dc.uid == sChild.uid);
            if (dChild) {
                toCompare.push({ snode: sChild.snode, node: dChild.node });
                dChilds.remove(dChild);
            }
            else {
                toInclude.push(sChild.snode);
            }
        }

        if (toCompare.any()) {
            //console.log('compare', toCompare)
            for (const comp of toCompare) {
                this.sync_compare(comp.snode, comp.node);
            }
        }

        if (toInclude.any()) {
            for (const inc of toInclude) {
                this.sync_include(inc, baseEl);
            }
        }

        if (dChilds.any()) {
            //console.log('remove', dChilds)
            for (const rem of dChilds) {
                this.umount_node(rem.uid, rem.node);
            }
        }
    }

    private filterTagChils(snode: SNode, result: SNode[]): SNode[] {
        for (const child of snode.childs) {
            if (child.tag || child.content) {
                result.push(child);
            }
            else {
                this.refs[child.uid] = { snode: child, version: child.version };
                this.filterTagChils(child, result);
            }
        }
        return result;
    }

    private sync_compare(snode: SNode, node: Node): void {

        // se chegou aqui, é pq tem node no dom e tbm tem refs

        const ref = this.refs[snode.uid]!;
        if (snode.version == ref.version) {
            return;
        }

        if (ref.node !== node) {
            throw 'SDom internal error!';
        }

        // checar tag
        if (!snode.tag && !snode.content) { // se não tem mais tag e nem content, virou um abstract
            // fazer um replace
            return;
        }
        if (snode.tag) {
            if (snode.tag.toLowerCase() != node.nodeName.toLowerCase()) {
                // fazer um replace
                return;
            }
        }
        if (snode.content) {
            const checkContent = snode.content.get();
            if (checkContent !== node.textContent) {
                node.textContent = checkContent;
            }
        }

        // checar attr
        if (snode.tag) {  // se tiver tag e chegou aq é pq é htmlelement
            const el = node as HTMLElement;
            const checkAttr = snode.attr.list.slice();
            for (let i = 0; i < el.attributes.length; i++) {
                const dAttr = el.attributes.item(i)!;
                const sAttr = checkAttr.find(ca => ca.name.toLowerCase() == dAttr.name.toLowerCase());
                if (sAttr) {
                    if (dAttr.value != sAttr.value) {
                        dAttr.value = <any>sAttr.value;
                    }
                    checkAttr.remove(sAttr);
                }
                else {
                    el.attributes.removeNamedItem(dAttr.name);
                    i--;
                }
            }
            for (const sAttr of checkAttr) {
                el.setAttribute(sAttr.name, <any>sAttr.value);
            }
        }

        // checar props

        // checar events

        // checar childs
        if (!snode.content) {
            this.sync_childs(snode);
        }
    }

    private sync_include(snode: SNode, baseEl: HTMLElement): void {

        let nextChild = this.findElement(snode);
        if (nextChild === baseEl) {
            nextChild = null;
        }
        else if (nextChild) {
            nextChild = nextChild.nextSibling;
        }

        const nodes = this.mount_node(snode, []);

        if (nextChild) {
            for (const node of nodes) {
                baseEl.insertBefore(node, nextChild);
            }
        }
        else {
            for (const node of nodes) {
                baseEl.appendChild(node);
            }
        }
    }

    private findElement(snode?: SNode): Node | null {
        if (snode) {
            const ref = this.refs[snode.uid];
            if (ref?.node) {
                return ref.node;
            }
            else {
                const before = snode.before();
                if (before) {
                    const last = this.findLastRecur(before);
                    return this.findElement(last);
                }
                else {
                    if (snode.parent) {
                        return this.findElement(snode.parent);
                    }
                }
            }
        }
        return null;
    }

    private findLastRecur(snode?: SNode): SNode | undefined {
        if (snode) {
            if (snode.tag || snode.content) {
                return snode;
            }
            else {
                return this.findLastRecur(snode.childs.last());
            }
        }
        return undefined;
    }

    private mount_node(snode: SNode, nodes: Node[]): Node[] {

        if (snode.tag) {
            const node = document.createElement(snode.tag);
            node.uid = snode.uid;
            this.refs[snode.uid] = { snode, node, version: snode.version };
            nodes.push(node);

            if (snode.content) {
                node.textContent = snode.content.get();
            }

            this.set_props(snode, node);
            this.set_events(snode, node);

            if (node.isHTMLElement()) {
                for (const attr of snode.attr) {
                    node.setAttribute(attr.name, <any>attr.value);
                }
                for (const child of snode.childs) {
                    const childNodes = this.mount_node(child, []);
                    for (const childNode of childNodes) {
                        node.appendChild(childNode);
                    }
                }
            }
            else {
                for (const child of snode.childs) {
                    this.mount_node(child, nodes);
                }
            }
            //return nodes;
        }
        else if (snode.content) {
            const node = document.createTextNode(snode.content.get());
            node.uid = snode.uid;
            this.refs[snode.uid] = { snode, node, version: snode.version };
            nodes.push(node);
            this.set_events(snode, node);
        }
        else {
            for (const child of snode.childs) {
                this.mount_node(child, nodes);
            }
        }
        
        return nodes;
    }

    private set_events(snode: SNode, node: Node): void {
        for (const event of snode.events) {
            let listener: EventListener | undefined;
            if (event.event) {
                if (typeof event.event == 'function') {
                    listener = event.event;
                }
                else if (snode.code) {
                    listener = snode.code[event.event].bind(snode.code);
                }
            }
            else if (snode.code) {
                listener = snode.code[event.name].bind(snode.code);
            }
            if (listener) {
                node.addEventListener(event.name, listener);
                (node.eventsName ||= []).push(event.name);
            }
            else {
                throw `Invalid listener for event \"${event.name}\" for SNode: ` + this;
            }
        }
    }

    private set_props(snode: SNode, node: Node): void {
        for (const prop of snode.props) {
            (<any>node)[prop.name] = prop.value;
        }
    }

    private umount_node(uid: number, node: Node): void {
        const ref = this.refs[uid];
        if (ref) {

            delete this.refs[uid];
        }
        node.parentElement!.removeChild(node);
    }
}