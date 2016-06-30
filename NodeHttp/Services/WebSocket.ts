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
        services.add<WebSocketService>(WebSocketService);
        WebSocketService.instance.server = services.httpServer;
        WebSocketService.instance.paths = paths;
        WebSocketService.instance.start();
    }

    export class WebSocketService implements httpServer.IServices {
        public static instance: WebSocketService;
        public server: httpServer.Server;
        public paths: Array<IPathItem>;
        public name: string;
        public type: httpServer.ServicesType;
        public instances: WebSocketService;
        public clients: system.AutoDictonary<Client>;

        private _server: any;

        constructor() {
            this.name = 'webSocket';
            this.type = httpServer.ServicesType.Singleton;
            this.clients = new system.AutoDictonary<Client>("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", 24);
            this.instances = this;
            WebSocketService.instance = this;
        }

        public getInstance(ctx: httpServer.IContext): WebSocketService {
            return this.instances;
        }

        public start(): void {
            this._server = new WebSocketServer.Server({ server: this.server.httpServer });
            this._server.on('connection', this.connection.bind(this));
        }

        private connection(socket: any): void {
            let id = this.clients.generateID();
            let client = new Client(id, socket);
            this.clients.set(id, client);
        }

        public sendAll(path: string, method: string, ...args: any[]): void {
            var clients = this.clients.toList();
            for (let i = 0, client: Client; client = clients[i]; i++) {
                for (let p = 0, item: IPath; item = client.items[p]; p++) {
                    if (item.name === path) {
                        client.send.apply(client, [item.index, method].concat(args));
                    }
                }
            }
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
            for (let i = 0, p: IPathItem; p = WebSocketService.instance.paths[i]; i++) {
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
            WebSocketService.instance.clients.remove(this.id);
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

            WebSocketService.instance.sendAll.apply(WebSocketService.instance, [path.name, method].concat(args));
        }
    }
}

export = internal;