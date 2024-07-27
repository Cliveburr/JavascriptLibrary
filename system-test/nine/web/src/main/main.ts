import path from 'path';
import { HttpApplication, IConfigure, IConfigureServices, IHttpApplication, NotFound } from 'webhost';
import Index from '../pages';

@HttpApplication({
    port: 8080,
    approot: path.resolve(__dirname, '../'),
    providers: [Index]
})
export class Nine implements IHttpApplication {
    
    public constructor(
    ) {
    }

    public configureServices(services: IConfigureServices): void {
    }

    public configure(app: IConfigure): void {
     
        app.use(Index);

        app.use(NotFound);
    }
}