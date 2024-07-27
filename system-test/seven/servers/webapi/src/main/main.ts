import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, StaticFiles, FileModule, DefaultFiles, DiagnosticLevel } from 'webhost';
import { WebSocketService } from '../websocket';
import { MainLoader } from './main.loader';
import { MAIN_PROVIDERS } from './providers';
import { CoreModule } from '@seven/core';
import { AppModule } from '@seven/app';
import { Session } from '@seven/framework';

const ALL_MODULES = [
    CoreModule,
    AppModule
]

@HttpApplication({
    imports: [FileModule, ALL_MODULES],
    providers: [MainLoader, WebSocketService, Session, MAIN_PROVIDERS],
    exports: [MainLoader, MAIN_PROVIDERS, ALL_MODULES],
    port: 1800,
    wwwroot: __dirname,
    diagnostic: DiagnosticLevel.Normal
})
export class HttpTestApplication implements IHttpApplication {

    public constructor(
        private webSocketService: WebSocketService, 
    ) {
    }

    public configureServices(services: IConfigureServices): void {
        this.webSocketService.configureWebSocket(services);
        
        global.httpServer = services.httpServer;
    }

    public configure(app: IConfigure): void {
        app.use(DefaultFiles);

        app.use(StaticFiles);

        app.use(NotFound);
    }
}
