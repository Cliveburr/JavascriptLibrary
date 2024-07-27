import { Host } from "../http/host";
import { DiagnosticLevel } from "../http/models";
import * as pipes from '../http/pipes';
import { WsServer } from "../http/ws/server";
import { LiveReload } from "./livereload";
import { PathProvider } from "./path-provider";

(<any>global).runn ||= 1;
console.log('Server running...', (<any>global).runn++);

const host = new Host({
    wwwroot: __dirname + '/../../../src/client',
    port: 4000,
    diagnosticLevel: DiagnosticLevel.Error,
    pipes: [
        new pipes.SpaPipe(),
        new pipes.ClientScript('/../../bin/client/'),
        new pipes.StaticFiles(),
        new pipes.NotFound()
    ]
});

const ws = new WsServer({
    host,
    pathProvider: new PathProvider([
        { path: 'livereload', cls: LiveReload },
        {
            path: 'test',
            childs: [
                //{ path: 'hiting', cls: TestPath } 
            ]
        }
    ])
});

global.reportClientFile = (path) => {
    if (path) {
        if (path == 'boot.js') {
            return;
        }
        if (!(path.endsWith('.js') || path.endsWith('.html'))) {
            return;            
        }
        if (path.startsWith('/')) {
            path = path.substr(1);
        }
        ws.callAll('livereload', 'reboot', path);
    }
}

host.start();
