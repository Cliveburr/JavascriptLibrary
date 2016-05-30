var WebSocketServer = require('ws');
import path = require('path');
import fs = require('fs');
import httpServer = require('../Http/HttpServer');
import system = require('../System');

module internal {
    export interface IPath {
        index: number;
        name?: string;
        create(client: Client): void;
    }

    export interface IPathType {
        new (): IPath;
    }

    export interface IPathItem {
        path: string;
        item: IPathType;
    }

    export interface IMessage {
        index: number;
        method: string;
        args: any[];
    }

    export class ClientFile implements httpServer.IPipeline {
        public process(ctx: httpServer.IContext, next: () => void): void {
            if (ctx.request.url == '/WebSocket') {

                var file = path.resolve(__dirname + '/../Client/WebSocket.js');

                ctx.response.writeHead(200, { "Content-Type": 'text/javascript' });
                ctx.response.write(fs.readFileSync(file).toString());
                ctx.alreadyProcess = true;
            }

            next();
        }
    }

    export function addServices(services: httpServer.IConfigureServices, paths: Array<IPathItem>): void {
        WebSocketService.server = services.httpServer;
        WebSocketService.paths = paths;
        services.add<WebSocketService>(WebSocketService);
    }

    export class WebSocketService implements httpServer.IServices {
        public static server: httpServer.Server;
        public static paths: Array<IPathItem>;
        public name: string;
        public type: httpServer.ServicesType;
        public instances: WebSocket;

        constructor() {
            this.name = 'webSocket';
            this.type = httpServer.ServicesType.Singleton;

            this.instances = new WebSocket();
        }

        public getInstance(ctx: httpServer.IContext): WebSocket {
            return this.instances;
        }
    }

    export class WebSocket {
        public static instance: WebSocket;
        private _server: any;
        public clients: system.AutoDictonary<Client>;

        constructor() {
            this.clients = new system.AutoDictonary<Client>("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", 24);
            this._server = new WebSocketServer.Server({ server: WebSocketService.server.httpServer });
            this._server.on('connection', this.connection.bind(this));
            WebSocket.instance = this;
        }

        private connection(socket: any): void {
            let id = this.clients.generateID();
            let client = new Client(id, socket);
            this.clients.set(id, client);
        }
    }

    export class Client {
        public items: Array<IPath>;

        constructor(
            public id: string,
            private _socket: any) {
            this.items = [];
            _socket.on('message', this.message.bind(this));
            _socket.on('close', this.close.bind(this));
        }

        private findItem(index: number): IPath {
            for (let i = 0, p: IPath; p = this.items[i]; i++) {
                if (p.index == index)
                    return p;
            }
            return null;
        }

        public findPathItem(path: string): IPathItem {
            for (let i = 0, p: IPathItem; p = WebSocketService.paths[i]; i++) {
                if (p.path == path)
                    return p;
            }
            return null;
        }

        private message(data: string): void {
            let msg: IMessage = JSON.parse(data);
            if (!msg.method && msg.args[0] === 'create_item') {
                let pathType = this.findPathItem(msg.args[1]);

                if (!pathType)
                    throw 'não tem esse path type'; //TODO: ver oque fazer

                let path = new pathType.item();
                path.index = msg.index;
                path.name = msg.args[1];
                path.create(this);
                this.items.push(path);
            }
            else {
                let path = this.findItem(msg.index);

                if (!path)
                    throw 'não tem esse path'; //TODO: ver oque fazer

                if (!path[msg.method])
                    throw 'não tem esse methodo';

                path[msg.method].apply(path, msg.args);
            }
        }

        public close(): void {
            WebSocket.instance.clients.remove(this.id);
        }

        public send(index: number, method: string, ...args: any[]): void {
            var m: IMessage = {
                index: index,
                method: method,
                args: args
            };
            this._socket.send(JSON.stringify(m));
        }

        public sendAll(index: number, method: string, ...args: any[]): void {
            let path = this.findItem(index);

            if (!path)
                throw 'não tem esse path'; //TODO: ver oque fazer

            var clients = WebSocket.instance.clients.toList();
            for (let i = 0, client: Client; client = clients[i]; i++) {
                for (let p = 0, item: IPath; item = client.items[p]; p++) {
                    if (item.name === path.name) {
                        client.send(item.index, method, args);
                    }
                }
            }
        }
    }
}

export = internal;