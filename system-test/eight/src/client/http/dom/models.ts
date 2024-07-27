import { SNode } from "./snode";

export type ISNodeTransport = 'tag';

export interface ISAttribute {
    name: string;
    value?: string | null;
}

export interface ISEvent {
    name: string;
    event?: string | ((...args: any[]) => void);
}

export interface ISProperty {
    name: string;
    value: any;
}

export interface ISNode {
    tag?: string;
    content?: string;
    attr?: ISAttribute[];
    events?: ISEvent[];
    childs?: ISNode[];
    code?: any;
    data?: any;
    parent?: ISNode;
}

export type ISActionsExec = () => void;

export interface IDomSyncRequest {
    snode: SNode
}

export interface IDomSyncContext {
    snode: SNode,
    timeout: number,
    exes: Array<() => void>,
    rejs: Array<(err: any) => void>
}
