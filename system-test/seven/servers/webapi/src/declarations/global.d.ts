declare type Server = import('http').Server
declare type WsServer = import('../websocket/websocket.service').WebSocketService;

declare module NodeJS {
    interface Global {
        reportWriteFile?: (path: string) => void,
        httpServer?: Server;
        modules: Array<{
            name: string;
            path: string;
            fullBinPath: string;
            isServer?: boolean;
            avoidClean?: boolean;
        }>;
        ws?: {
            wsServer: WsServer
        }
    }
}