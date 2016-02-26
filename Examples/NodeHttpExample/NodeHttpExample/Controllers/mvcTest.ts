import mvc = require('../../../../NodeHttp/Http/MVC');

class mvcTest {
    public static $inject = ['session'];

    constructor(
        private _session: any) {
    }

    public state(params: mvc.IMVCMethodParams): void {
        if (params.request.method == 'GET') {
            if (!this._session.data)
                this._session.data = 0;

            let data = JSON.stringify({ 'someData': 1234, session_count: this._session.data++  });

            params.response.writeHead(200, { "Content-Type": "application/json" });
            params.response.write(data);

            console.log('state get! content: ' + data);
        }
        else if (params.request.method == 'POST') {
            let data = JSON.parse(params.postContent);

            if (!data)
                return;

            params.response.statusCode = 200;

            console.log('state post! content: ' + params.postContent);
        }
        else {
            params.isProcessed = false;
        }
    }

    public discovery(params: mvc.IMVCMethodParams): void {
        params.response.statusCode = 200;
        console.log('discovery!');
    }
}

export = mvcTest;