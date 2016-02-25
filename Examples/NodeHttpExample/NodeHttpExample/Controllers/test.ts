import mvc = require('../../../../NodeHttp/Http/MVC');
import api = require('../../../../NodeHttp/Http/Api/ApiController');


class ledController extends api.ApiController {

    public state(params: mvc.IMVCMethodParams): void {
        if (params.request.method == 'GET') {
            let data = JSON.stringify({ 'someData': 1234 });

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

export = ledController;