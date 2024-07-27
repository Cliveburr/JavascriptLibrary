import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, StaticFiles, FileModule, DefaultFiles, DiagnosticLevel } from 'webhost';
// import { WebSocketService } from '../websocket';
// import { MainLoader } from './main.loader';
import { MAIN_PROVIDERS } from './providers';
import { CoreModule } from '@ten/core_business';
// import { AppModule } from '@seven/app';
// import { Session } from '@seven/framework';

import { WebSocketService } from '../websocket';

const ALL_MODULES: any[] = [
    CoreModule,
    // AppModule
]

@HttpApplication({
    imports: [FileModule, ALL_MODULES],
    providers: [MAIN_PROVIDERS, WebSocketService/*MainLoader, Session*/],
    exports: [MAIN_PROVIDERS /*MainLoader, ALL_MODULES*/],
    port: 1800,
    wwwroot: __dirname,
    diagnostic: DiagnosticLevel.Normal
})
export class TenHttpApplication implements IHttpApplication {

    public constructor(
        private webSocketService: WebSocketService
    ) {
    }

    public configureServices(services: IConfigureServices): void {
        this.webSocketService.configureWebSocket(services);
    }

    public configure(app: IConfigure): void {
        app.use(DefaultFiles);
        app.use(StaticFiles);
        app.use(NotFound);
    }
}
