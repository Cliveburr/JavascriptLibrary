


//class Test implements NodeHttp.WebSocket.IPath {
//    public index: number;
//    private _conn: NodeHttp.WebSocket.Connection;

//    public create(connection: NodeHttp.WebSocket.Connection): void {
//        this._conn = connection;
//    }

//    public sendHolla(): void {
//        this._conn.send(this.index, 'sendHolla', 'hollaaaaaaaaa');
//    }

//    public returnHolla(): void {
//        alert('returnn from holla');
//    }
//}

//NodeHttp.WebSocket.paths.push({ path: 'Test', item: Test });

//var host = window.document.location.host.replace(/:.*/, '');
//var ws = NodeHttp.WebSocket.connect(host, 1337);
//ws.ready(() => {

//    //debugger;
//    var test = ws.createPath<Test>('Test');
//    test.sendHolla();


//});;


//document.onreadystatechange = function () {
//    if (document.readyState == "complete") {
//    }
//}

//DOC.childs.push({ html: '<div>testando</div>' });


//DOC.childs.push({
//    htmlUrl: '/Sample.html',
//    jsUrl: '/SampleScript.js',
//    cssUrl: '/SampleStyle.css'
//});

DynamicLoader.getHtml('/Sample.html', (success: boolean, data: string) => {
    if (success) {
        document.body.innerHTML = data;
    }

    DynamicLoader.getScript('/SampleScript.js');
});

DynamicLoader.getStyle('/SampleStyle.css');

DynamicTag.setTag({
    tag: 'customButton',
    htmlUrl: '/Objects/CustomButton.html',
});

//document.onreadystatechange = function () {
//    if (document.readyState == "complete") {
//        //DynamicTag.renderHtml(document.body, '<div>testando 2</div>');

//        DynamicTag.renderUrl(document.body, '/Sample.html', '/SampleScript.js');
//        DynamicLoader.getStyle('/SampleStyle.css');
//    }
//}