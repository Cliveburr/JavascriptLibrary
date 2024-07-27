declare type Server = import('http').Server
declare type WsServer = import('../http/ws/server').WsServer;

declare global {
    var host: {
        httpServer: Server,
        handleRequestBind: (...args: any[]) => void
    } | undefined;
    var ws: {
        wsServer: WsServer
    } | undefined;
}

export {};