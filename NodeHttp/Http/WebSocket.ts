import WebSocketServer = require('ws');
import httpServer = require('./HttpServer');

module internal {
    export class Server {
        private _server: WebSocketServer.Server;

        constructor(server: httpServer.Server) {
            this._server = new WebSocketServer.Server({ server: server.httpServer });
        }

        public on(event: string, listener: (ret?: any) => void): void {
            this._server.on(event, listener);
        }
    }
}

export = internal;