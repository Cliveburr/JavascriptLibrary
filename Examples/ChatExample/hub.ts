import webSocket = require('../../NodeHttp/Services/WebSocket');

module intern {
    export class ChatHub implements webSocket.IPath {
        public index: number;
        private _client: webSocket.Client;

        public create(client: webSocket.Client): void {
            this._client = client;
        }

        public send(user: string, msg: string): void {
            this.receive(user, msg);
        }

        public receive(user: string, msg: string): void {
            this._client.sendAll(this.index, 'receive', user, msg);
        }
    }
}

export = intern;