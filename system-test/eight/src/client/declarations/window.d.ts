declare type SDom = import('../http/dom/shadow-dom').SDom;
declare type SNode = import('../http/dom/snode').SNode;

declare interface Window {
    runs: number;
    exports: any;
    module: { exports: any };
    require: (file: string) => Promise<any>;
    bootClient(): void;
    contentCache: { [file: string]: string };
    cache: { [file: string]: any };
    ws?: {
        wsClient: WebSocket,
        onopenBind: (...args: any[]) => void,
        onerrorBind: (...args: any[]) => void,
        oncloseBind: (...args: any[]) => void,
        onmessageBind: (...args: any[]) => void
    },
    sdom?: SDom,
    uid: number
}

declare const require = window.require;

declare interface Node {
    uid: number;
    eventsName?: string[];
}