import httpServer = require('../../NodeHttp/Http/HttpServer');
import webSocket = require('../../NodeHttp/Services/WebSocket');
import fs = require('fs');
import path = require('path');

module internal {
    export function addServices(services: httpServer.IConfigureServices): void {
        DynamicLoaderService.server = services.httpServer;
        webSocket.WebSocketService.paths.push({ path: 'ItemPath', item: ItemPath });
        services.add<DynamicLoaderService>(DynamicLoaderService);
    }

    export class DynamicLoaderService implements httpServer.IServices {
        public static server: httpServer.Server;
        public static items: Array<Item> = [];
        public name: string;
        public type: httpServer.ServicesType;
        public instances: this;

        constructor() {
            this.name = 'dynamicLoader';
            this.type = httpServer.ServicesType.Singleton;

            this.instances = this;
        }

        public getInstance(ctx: httpServer.IContext): this {
            return this.instances;
        }
    }

    class Item {
        public fullName: string;

        constructor(
            public url: string,
            public itemPath: ItemPath) {

            var parts: string[] = url.split('/').removeAll('');
            parts.unshift(DynamicLoaderService.server.wwwroot);
            this.fullName = path.resolve(parts.join('\\'));

            fs.watch(this.fullName, this.onWatch.bind(this));
        }

        private onWatch(): void {
            this.itemPath.refreshItem(this.url);
        }
    }

    function find(url: string): Item {
        for (let i = 0, item: Item; item = DynamicLoaderService.items[i]; i++) {
            if (item.url == url)
                return item;
        }
        return null;
    }

    class ItemPath implements webSocket.IPath {
        public index: number;
        private _client: webSocket.Client;

        public create(client: webSocket.Client): void {
            this._client = client;
        }

        public addItem(url: string): void {
            let item = find(url);

            if (!item) {
                item = new Item(url, this);
                DynamicLoaderService.items.push(item);
            }

            this.refreshItem(url);
        }

        public refreshItem(url: string): void {
            this._client.sendAll(this.index, 'refreshItem', url);
        }
    }
}

export = internal;