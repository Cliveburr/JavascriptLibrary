declare type Server = import('http').Server
declare type WsServer = import('../http/ws/server').WsServer;

declare module NodeJS {
    interface Global {
        reportWriteFile?: (path: string) => void,
        reportClientFile?: (path?: string) => void,
        host?: {
            httpServer: Server,
            handleRequestBind: (...args: any[]) => void
        },
        ws?: {
            wsServer: WsServer
        }
    }
}