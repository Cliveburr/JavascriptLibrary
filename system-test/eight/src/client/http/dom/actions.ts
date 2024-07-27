// import { ISActionsExec, ISAttribute, ISEvent } from "./models";
// import { isHTMLElement, SNode, SNodeChilds } from "./snode";

// export class SActions {

//     public constructor(
//         private addAction: (actionExec: ISActionsExec) => void
//     ) {
//     }

//     private isHTMLElement(node: Node): node is HTMLElement {
//         return (!(node.nodeName == '#text' || node.nodeName == '#comment'));
//     }

//     private getHTMLElementParent(snode?: SNode): HTMLElement | undefined {
//         if (snode && snode.node) {
//             if (this.isHTMLElement(snode.node)) {
//                 return snode.node;
//             }
//             else {
//                 return this.getHTMLElementParent(snode.parent);
//             }
//         }
//         return undefined;
//     }

//     public attrClean(snode: SNode): void {
//         if (snode.node) {
//             this.addAction(this.attrClean_exec.bind(this, snode));
//         }
//     }
//     private attrClean_exec(snode: SNode): void {
//         const node = snode.node!;
//         if (this.isHTMLElement(node)) {
//             while (node.attributes.length > 0) {
//                 node.removeAttribute(node.attributes[0]!.name);
//             }
//         }
//     }

//     public attrPush(snode: SNode, newChilds: ISAttribute[]): void {
//         if (snode.node) {
//             this.addAction(this.attrPush_exec.bind(this, snode, newChilds));
//         }
//     }
//     private attrPush_exec(snode: SNode, attrs: ISAttribute[]): void {
//         const node = snode.node!;
//         if (this.isHTMLElement(node)) {
//             for (const attr of attrs) {
//                 node.setAttribute(attr.name, attr.value);
//             }
//         }
//     }

//     public childsClean(snode: SNode): void {
//         if (snode.node) {
//             this.addAction(this.childsClean_exec.bind(this, snode));
//         }
//     }
//     private childsClean_exec(snode: SNode): void {
//         for (const child of snode.childs) {
//             snode.node!.removeChild(child.node!);
//         }
//         // let child: ChildNode | null;
//         // while (child = snode.node!.lastChild) {
//         //     snode.node!.removeChild(child);
//         // }
//     }

//     public childsPush(snode: SNode, newChilds: SNode[]): void {
//         if (snode.node) {
//             this.addAction(this.childsPush_exec.bind(this, snode, newChilds));
//         }
//     }
//     private childsPush_exec(snode: SNode, newChilds: SNode[] | SNodeChilds): void {

//         for (const newChild of newChilds) {
//             newChild.buildNode();
//         }

//         if (isHTMLElement(snode.node!)) {
//             for (const newChild of newChilds) {
//                 newChild.parent = snode;
//                 snode.node.appendChild(newChild.node!);
//                 this.childsPush_exec(newChild, newChild.childs);
//             }
//         }
//         else {

//             const elParent = this.findParentHTMLElement(snode.parent!);
            



//             let sParent = this.findMyPosition(snode);
                
//             if (!sParent) {
//                 throw 'Invalid push into elements not in real DOM!';
//             }
//             for (const newChild of newChilds) {
//                 if (sParent.child.nextSibling) {
//                     sParent.parent.insertBefore(newChild.node!, sParent.child.nextSibling);
//                 }
//                 else {
//                     sParent.parent.appendChild(newChild.node!);
//                 }
//                 if (!this.isHTMLElement(newChild.node!)) {
//                     this.childsPush_exec(newChild, newChild.childs);
//                 }
//             }
//         }
//     }

//     private findParentHTMLElement(snode: SNode): HTMLElement {
//         if (isHTMLElement(snode.node!)) {
//             return snode.node;
//         }
//         else {
//             return this.findParentHTMLElement(snode.parent!);
//         }
//     }
    
//     // private findFirstPosition(host: SNode): { parent: HTMLElement, child?: ChildNode } | undefined {
//     //     if (host.node && isHTMLElement(host.node)) {
//     //         return {
//     //             parent: host.node
//     //         }
//     //     }
//     //     else {

//     //     }
//     // }

//     // private findLastPosition(snode: SNode, lastChild?: SNode): { parent: HTMLElement, child: ChildNode | null } | undefined {
//     //     if (snode.node && isHTMLElement(snode.node)) {
//     //         return {
//     //             parent: snode.node,
//     //             child: snode.node.lastChild
//     //         }
//     //     }
//     // }

//     private findMyPosition(snode: SNode, lastChild?: SNode): { parent: HTMLElement, child: ChildNode } | undefined {
//         let sParent = snode.parent;
//         if (!sParent || !sParent.node) {
//             return undefined;
//         }
//         if (isHTMLElement(sParent.node)) {
//             for (const child of sParent.node.childNodes) {
//                 if (child == (lastChild?.node || snode.node)) {
//                     return {
//                         parent: sParent.node,
//                         child
//                     };
//                 }
//             }
//         }
//         else {
//             const lastChild = sParent.childs.last();
//             return this.findMyPosition(sParent, lastChild);
//         }
//         return undefined;
//     }

//     public eventPush(snode: SNode, events: ISEvent[]): void {
//         if (snode.node) {
//             this.addAction(this.eventPush_exe.bind(this, snode, events));
//         }
//     }
//     public eventPush_exe(snode: SNode, events: ISEvent[]): void {
//         for (const event of events) {
//             let listener: EventListener | undefined;
//             if (event.event) {
//                 if (typeof event.event == 'function') {
//                     listener = event.event;
//                 }
//                 else if (snode.code) {
//                     listener = snode.code[event.event].bind(snode.code);
//                 }
//             }
//             else if (snode.code) {
//                 listener = snode.code[event.name].bind(snode.code);
//             }
//             if (listener && isHTMLElement(snode.node!)) {
//                 snode.node.addEventListener(event.name, listener);
//             }
//             else {
//                 throw `Invalid listener for event \"${event.name}\" for SNode: ` + this;
//             }
//         }
//     }
// }