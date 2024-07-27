import { Host, WsServer, DiagnosticLevel, StaticFiles, NotFound } from 'framework-server';
// import * as pipes from '../http/pipes';
// import { WsServer } from "../http/ws/server";
// import { LiveReload } from "./livereload";
// import { PathProvider } from "./path-provider";
import { Application, N, ApplicationPipe, Node } from 'framework-server';

(<any>global).runn ||= 1;
console.log('Server running...', (<any>global).runn++);

/*
class Button extends Node {

    private hook?: NodeHook;
    private click: number = 0;

    constructor() {
        super('button');
        this.innerText = 'click 0';
    }

    public init(ctx: InitContext): void {
        this.hook = ctx.getHook();

        this.attributes = {
            id: this.id
        };

        this.hook.setEvent('onclick', this.button_onclick.bind(this));
    }

    private button_onclick(event: OnClickEvent): void {
        event.setInnerText(`click ${this.click++}`);
    }

    public build(): string {
        return super.build();
    }
}
*/

// const app = new Application(
//     N({ tag: 'html', childs: [
//         N({ tag: 'head', childs: [
//             N({ tag: 'meta', attributes: { 'charset': 'utf-8' }, selfClose: true }),
//             N({ tag: 'title', innerText: 'Websocket App' })
//         ]}),
//         N({ tag: 'body', childs: [
//             N({ tag: 'h1', innerText: 'iniciando' }),
//             new Button(),
//             N({ tag: 'script', attributes: { 'type': 'module', 'src': 'web-socket/ws-client.js' }, selfClose: true })
//         ]})
//     ]})
// );
const app = new Application(__dirname + '/../../src/main/index.html');

const host = new Host({
    port: 4000,
    diagnosticLevel: DiagnosticLevel.Error,
    pipes: [
        new StaticFiles(__dirname + '/../../../framework/client/bin'),
        new ApplicationPipe(app),
        new NotFound()
    ]
});

const ws = new WsServer({
    host,
    app
});

host.start();
