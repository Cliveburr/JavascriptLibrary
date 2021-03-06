/// <reference path="../../../NodeHttp/Client/WebSocket.ts"/>


class ChatHub implements NodeHttp.WebSocket.IPath {
    public index: number;
    private _conn: NodeHttp.WebSocket.Connection;
    private _receiveDiv: HTMLDivElement;

    public create(connection: NodeHttp.WebSocket.Connection): void {
        this._conn = connection;
        this._receiveDiv = <HTMLDivElement>document.getElementById('receive');
    }

    public send(user: string, msg: string): void {
        this._conn.send(this.index, 'send', user, msg);
    }

    public receive(user: string, msg: string): void {
        let p = document.createElement('p');
        p.innerText = user + ': ' + msg;
        this._receiveDiv.appendChild(p);
    }
}

NodeHttp.WebSocket.paths.push({ path: 'Chat', item: ChatHub });
var host = window.document.location.host.replace(/:.*/, '');
var ws = NodeHttp.WebSocket.connect(host, 1338);

ws.ready(() => {

    var user = <HTMLInputElement>document.getElementById('user');
    var msg = <HTMLInputElement>document.getElementById('msg');
    var sender = <HTMLInputElement>document.getElementById('sender');

    var chat = ws.createPath<ChatHub>('Chat');

    sender.onclick = (ev) => {

        let userName = user.value;
        if (!userName) {
            alert('Must be have a name!');
            return;
        }

        let userMsg = msg.value;
        if (!userMsg) {
            alert('Must be a msg!');
            return;
        }

        chat.send(user.value, msg.value);
    };
});