import httpServer = require('../../NodeHttp/Http/HttpServer');
import webSocket = require('../../NodeHttp/Services/WebSocket');
import fs = require('fs');
import path = require('path');

module internal {
    export function addServices(services: httpServer.IConfigureServices): void {
        webSocket.WebSocketService.instance.paths.push({ path: 'ItemPath', item: ItemPath });
        services.add<DynamicLoaderService>(DynamicLoaderService);
        DynamicLoaderService.instance.server = services.httpServer;
    }

    class DynamicLoaderService implements httpServer.IServices {
        public static instance: DynamicLoaderService;
        public server: httpServer.Server;
        public items: Array<Item> = [];
        public name: string;
        public type: httpServer.ServicesType;
        public instances: DynamicLoaderService;

        constructor() {
            this.name = 'dynamicLoader';
            this.type = httpServer.ServicesType.Singleton;
            this.instances = this;
            DynamicLoaderService.instance = this;
        }

        public getInstance(ctx: httpServer.IContext): DynamicLoaderService {
            return this.instances;
        }

        public find(url: string): Item {
            for (let i = 0, item: Item; item = this.items[i]; i++) {
                if (item.url == url)
                    return item;
            }
            return null;
        }
    }

    class Item {
        public fullName: string;

        private _lock: boolean;

        constructor(
            public url: string) {
            this._lock = false;

            var parts: string[] = url.split('/').removeAll('');
            parts.unshift(DynamicLoaderService.instance.server.wwwroot);
            this.fullName = path.resolve(parts.join('\\'));

            fs.watch(this.fullName, this.onWatch.bind(this));
        }

        private onWatch(event: string): void {
            if (!this._lock) {
                this._lock = true;
                webSocket.WebSocketService.instance.sendAll('ItemPath', 'refreshItem', this.url);
                setTimeout(this.unlock.bind(this), 300);
            }
        }

        private unlock(): void {
            this._lock = false;
        }
    }

    class ItemPath implements webSocket.IPath {
        public index: number;
        private _client: webSocket.Client;

        public create(client: webSocket.Client): void {
            this._client = client;
        }

        public addItem(url: string): void {
            let item = DynamicLoaderService.instance.find(url);

            if (!item) {
                item = new Item(url);
                DynamicLoaderService.instance.items.push(item);
            }

            this.refreshItem(url);
        }

        public refreshItem(url: string): void {
            this._client.sendAll(this.index, 'refreshItem', url);
        }
    }
}

export = internal;