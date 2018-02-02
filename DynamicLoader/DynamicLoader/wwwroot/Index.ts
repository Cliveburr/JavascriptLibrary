


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

//DynamicLoader.getHtml('/Sample.html', (success: boolean, data: string) => {
//    if (success) {
//        document.body.innerHTML = data;
//    }

//    DynamicLoader.getScript('/SampleScript.js');
//});

//DynamicLoader.getStyle('/SampleStyle.css');

//DynamicTag.setTag({
//    tag: 'customButton',
//    htmlUrl: '/Objects/CustomButton.html',
//});

class tagProvider implements DynamicTag.ITagProvider {
    public test(tagName: string): boolean {
        return /^DY-/.test(tagName);
    }

    public define(tag: DynamicTag.IDefinition): void {
        let name = /^DY-(.*)/.exec(tag.name)[1];
        name = name[0].toUpperCase() + name.substr(1).toLowerCase();
        tag.htmlUrl = `/Elements/${name}/${name}.html`;
        tag.scripts = [`/Elements/${name}/${name}.js`];
        tag.controller = `app.Elements.${name}`;
    }
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        //DynamicTag.renderHtml(document.body, '<div>testando 2</div>');
        //DynamicTag.renderUrl(document.body, '/Sample.html', '/SampleScript.js');
        DynamicLoader.getStyle('/SampleStyle.css');
        DynamicLoader.getScript('/SampleScript.js');

        DynamicTag.setTagProvider(new tagProvider());

        var body = new DynamicTag.Anchor({
                htmlUrl: '/Sample.html'
            })
            //.onAfterRender((data) => alert('alterou'))
            .insertInto(document.body);

        //var i1 = document.createElement('input');
        //i1.type = 'text';
        //document.body.appendChild(i1);

        //var b1 = document.createElement('input');
        //b1.type = 'button';
        //b1.value = 'click';
        //document.body.appendChild(b1);
        
        //var t1 = document.createComment('teste');
        ////document.body.appendChild(t1);

        //var t2 = document.createTextNode('text');
        //document.body.appendChild(t2);

        //b1.onclick = () => {
        //    t2.textContent = i1.value;
        //};

    }
}    