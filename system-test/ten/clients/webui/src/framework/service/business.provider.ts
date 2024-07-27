import { WebSocketService } from "./websocket/websocket.service";
    
export const businessProviderFor = function(area: string, ...provides: any[]) {
    return provides.map(provide => { return {
        provide,
        useFactory: (websocketService: WebSocketService) => {
            const name = provide.name;
            const proxie = new BusinessProxy(`${area}.${name}`, websocketService);
            return proxie.proxy;
        },
        deps: [WebSocketService]
    } });
}

export class BusinessProxy {

    public proxy: any;

    public constructor(
        public path: string,
        public websocketService: WebSocketService
    ) {
        this.proxy = new Proxy({}, this.proxyHandler())
    }

    private proxyHandler(): ProxyHandler<any> {
        return {
            get: this.proxyHandlerGet.bind(this)            
        }
    }

    private proxyHandlerGet(target: any, name: string): any {
        return this.websocketService.call.bind(this.websocketService, this.path, name);
    }
}