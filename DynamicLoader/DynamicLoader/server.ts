import httpServer = require('../../NodeHttp/Http/HttpServer');
import files = require('../../NodeHttp/Http/Files');
import webSocket = require('../../NodeHttp/Services/WebSocket');
import dl = require('./DynamicLoader.Server');

var server = new httpServer.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

class Test implements webSocket.IPath {
    public index: number;
    private _client: webSocket.Client;

    public create(client: webSocket.Client): void {
        this._client = client;
    }

    public sendHolla(text: string): void {
        console.log('holla: ' + text);
        this.returnHolla();
    }

    public returnHolla(): void {
        this._client.send(this.index, 'returnHolla');
    }
}

server.configureServices((services) => {

    webSocket.addServices(services, [
        { path: 'Test', item: Test }
    ]);

});

server.configure((app) => {

    app.use(files.DefaultFiles);

    app.use(files.StaticFiles);

    app.use(webSocket.ClientFile);

    app.useErrorNotFound();

});

server.listen(1337);