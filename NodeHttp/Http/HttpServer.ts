import http = require('http');

module internal {
    export interface IPipeline {
        process(pipeInfo: IPipeInfo, next: () => void): void;
    }

    export interface IPipelineType {
        new (...params: any[]): IPipeline;
        $inject?: string[];
        $pipeReusable?: boolean;
        instance?: IPipeline;
    }

    export interface IPipeInfo {
        alreadyProcess: boolean;
        server: Server;
        request: http.IncomingMessage;
        response: http.ServerResponse;
        inject<T>(obj: any, ...params: any[]): T;
        getService<T>(name: string): T;
    }

    export enum ServicesType {
        Singleton = 0,
        PerRequest = 1,
        PerCall = 2
    }

    export interface IServicesSingletonType {
        new (): any;
    }

    export interface IServices {
        name: string;
        type: ServicesType;
        instances?: any[];
        getInstance: () => any;
        configuration?(config: any): void;
    }

    export interface IServicesType {
        new (): IServices;
    }

    export interface IConfigureServices {
        httpServer: Server;
        add(service: IServicesType, configuration?: (config: any) => void): void;
        addSingleton<T>(name: string, service: IServicesSingletonType, configuration?: (service: T) => void): void;
    }

    export interface IConfigure {
        use(pipe: IPipelineType): void;
        useErrorNotFound(): void;
        useService<T>(name: string): T;
    }

    export interface IServerConfigs {
        rootApp: string;
        wwwroot: string;
    }

    export class Server {
        public httpServer: http.Server;
        public rootApp: string;
        public wwwroot: string;

        private _pipe: IPipelineType[];
        private _injector: Injector;

        constructor(configs: IServerConfigs) {
            var that = this;
            this.rootApp = configs.rootApp;
            this.wwwroot = configs.wwwroot;
            this._pipe = [];
            this._injector = new Injector();
            this.httpServer = http.createServer((req, res) => that.handleRequest(req, res));
        }

        private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
            var pipeInfo: IPipeInfo = {
                alreadyProcess: false,
                server: this,
                request: req,
                response: res,
                inject: this._injector.make,
                getService: this._injector.read
            };

            try {
                var i = 0;
                var processPipe = (pipe: IPipelineType) => {
                    if (pipe && !pipeInfo.alreadyProcess) {

                        if (!pipe.instance || ('pipeReusable' in pipe && !pipe.$pipeReusable))
                            pipe.instance = this._injector.make(pipe);

                        this._pipe[i].instance.process(pipeInfo, () => {
                            i++;
                            processPipe(this._pipe[i]);
                        });
                    }
                    else {
                        res.end();
                    }
                };
                processPipe(this._pipe[i]);
            }
            catch (err) {
                pipeInfo.response.statusCode = 500;
                res.end();
            }
        }

        public configureServices(configure: (services: IConfigureServices) => void): void {
            configure({
                httpServer: this,
                add: (services, configuration) => this.services_add(services, configuration),
                addSingleton: (name, service, configuration?) => this.add_singleton(name, service, configuration)
            });
        }

        public configure(configure: (app: IConfigure) => void): void {
            var that = this;
            configure({
                use: (pipe) => that.pipe_use(pipe),
                useErrorNotFound: () => that.pipe_use(ErrorNotFound),
                useService: (name) => that._injector.read(name)
            });
        }

        public listen(port: number): void {
            this.httpServer.listen(port);
        }

        private pipe_use(pipe: IPipelineType): void {
            this._pipe.push(pipe);
        }

        private services_add(service: IServicesType, configuration?: (config: any) => void): void {
            var newService = new service();
            if (configuration)
                newService.configuration = configuration;
            this._injector.add(newService);
        }

        private add_singleton(name: string, service: IServicesSingletonType, configuration?: (config: any) => void): void {
            var that = this;
            this._injector.add({
                name: name,
                type: ServicesType.Singleton,
                configuration: configuration,
                getInstance: () => that._injector.make(service)
            });
        }
    }

    class Injector {
        private _services: IServices[];

        constructor() {
            this._services = [];
        }

        public add(service: IServices): void {
            if (!service.instances)
                service.instances = [];

            this._services.push(service);
        }

        public make(obj: any, ...params: any[]): any {
            if (!obj['$inject']) {
                return new obj(params);
            }
            else {
                var injection = [];
                var inject = <string[]>obj['$inject'];

                for (var i = 0, inj: string; inj = inject[i]; i++) {
                    inj = inj.trim();

                    var instance = this.read(inj);

                    injection.push(instance);
                }

                return new (Function.prototype.bind.apply(obj, [null].concat(injection.concat(params))));
            }
        }

        public read(name: string): any {
            var service = this._services.filterOne((s) => name == s.name);
            if (!service)
                throw 'Dependencie \"{0}\" not found!'.format(name);

            var instance = null;
            switch (service.type) {
                case ServicesType.Singleton:
                    {
                        if (!service.instances[0]) {
                            service.instances[0] = service.getInstance();
                            if (service.configuration)
                                service.configuration(service.instances[0]);
                        }
                        instance = service.instances[0];
                        break;
                    }
            }

            return instance;
        }
    }

    export class ErrorNotFound implements IPipeline {
        public process(pipeInfo: IPipeInfo, next: () => void): void {
            pipeInfo.response.statusCode = 404;
            next();
        }
    }
}

export = internal;