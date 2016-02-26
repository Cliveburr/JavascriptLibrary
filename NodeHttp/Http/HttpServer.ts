import http = require('http');
import collection = require('../System/Collection');

module internal {
    export interface IPipeline {
        process(ctx: IContext, next: () => void): void;
    }

    export interface IPipelineType {
        new (...params: any[]): IPipeline;
        $inject?: string[];
        $reusable?: boolean;
        instance?: IPipeline;
    }

    export interface IContext {
        guid: string;
        alreadyProcess: boolean;
        server: Server;
        request: http.IncomingMessage;
        response: http.ServerResponse;
        inject<T>(obj: any, ...params: any[]): T;
        getService<T>(name: string): T;
    }

    export enum ServicesType {
        Singleton = 0,
        Local = 1,
        PerRequest = 2
    }

    export interface IServicesDirectlyType {
        new (): any;
    }

    export interface IServices {
        name: string;
        type: ServicesType;
        instances?: any;
        getInstance: (ctx: IContext) => any;
        configuration?(config: any): void;
    }

    export interface IServicesType {
        new (): IServices;
    }

    export interface IConfigureServices {
        httpServer: Server;
        add<T>(service: IServicesType, configuration?: (config: T) => void): void;
        addSingleton<T>(name: string, service: IServicesDirectlyType, configuration?: (service: T) => void): void;
        addLocal<T>(name: string, service: IServicesDirectlyType, configuration?: (service: T) => void): void;
        addPerRequest<T>(name: string, service: IServicesDirectlyType, configuration?: (service: T) => void): void;
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
        private _contexts: collection.AutoDictonary<IContext>;

        constructor(configs: IServerConfigs) {
            var that = this;
            this.rootApp = configs.rootApp;
            this.wwwroot = configs.wwwroot;
            this._pipe = [];
            this._injector = new Injector();
            this._contexts = new collection.AutoDictonary<IContext>('asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM0123456789', 10);
            this.httpServer = http.createServer((req, res) => that.handleRequest(req, res));
        }

        private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
            var ctx: IContext = {
                guid: null,
                alreadyProcess: false,
                server: this,
                request: req,
                response: res,
                inject: (obj: any) => this._injector.make(ctx, obj),
                getService: (name: string) => this._injector.read(ctx, name)
            };
            ctx.guid = this._contexts.autoSet(ctx);

            try {
                var i = 0;
                var processPipe = (pipe: IPipelineType) => {
                    if (pipe && !ctx.alreadyProcess) {
                        if ('$reusable' in pipe && !pipe.$reusable)
                            delete pipe['instance'];

                        var instance = pipe.instance ?
                            pipe.instance :
                            this._injector.make(ctx, pipe);

                        instance.process(ctx, () => {
                            i++;
                            processPipe(this._pipe[i]);
                        });
                    }
                    else {
                        this.endRequest(ctx);
                    }
                };
                processPipe(this._pipe[i]);
            }
            catch (err) {
                ctx.response.statusCode = 500;
                this.endRequest(ctx);
            }
        }

        private endRequest(context: IContext): void {
            context.response.end();
            this._injector.release(context.guid);
            this._contexts.remove(context.guid);
        }

        public configureServices(configure: (services: IConfigureServices) => void): void {
            configure({
                httpServer: this,
                add: (services, configuration) => this.services_add(services, configuration),
                addSingleton: (name, service, configuration?) => this.add_directly(name, service, ServicesType.Singleton, configuration),
                addLocal: (name, service, configuration?) => this.add_directly(name, service, ServicesType.Local, configuration),
                addPerRequest: (name, service, configuration?) => this.add_directly(name, service, ServicesType.PerRequest, configuration)
            });
        }

        public configure(configure: (app: IConfigure) => void): void {
            var that = this;
            configure({
                use: (pipe) => that.pipe_use(pipe),
                useErrorNotFound: () => that.pipe_use(ErrorNotFound),
                useService: (name) => that._injector.read(null, name)
            });
        }

        public listen(port: number): void {
            this._injector.release('ini');
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

        private add_directly(name: string, service: IServicesDirectlyType, type: ServicesType, configuration?: (config: any) => void): void {
            var that = this;
            this._injector.add({
                name: name,
                type: type,
                configuration: configuration,
                getInstance: (ctx) => {
                    var instance = that._injector.make(ctx, service)
                    if (configuration)
                        configuration(instance);
                    return instance;
                }
            });
        }
    }

    class Injector {
        private _services: IServices[];
        private _requestCache: any;

        constructor() {
            this._services = [];
            this._requestCache = {};
        }

        public add(service: IServices): void {
            this._services.push(service);
        }

        public make(ctx: IContext, obj: any, ...params: any[]): any {
            if (!obj['$inject']) {
                return new obj(params);
            }
            else {
                var injection = [];
                var inject = <string[]>obj['$inject'];

                for (var i = 0, inj: string; inj = inject[i]; i++) {
                    var instance = this.read(ctx, inj);
                    if (!instance)
                        throw 'Dependencie \"{0}\" not found!'.format(inj);

                    injection.push(instance);
                }

                return new (Function.prototype.bind.apply(obj, [null].concat(injection.concat(params))));
            }
        }

        public read(ctx: IContext, name: string): any {
            var service = this._services.filterOne((s) => name == s.name);
            if (!service)
                return null;

            var instance = null;
            switch (service.type) {
                case ServicesType.Singleton:
                    {
                        if (!service.instances) {
                            service.instances = service.getInstance(ctx);
                        }
                        instance = service.instances;
                        break;
                    }
                case ServicesType.Local:
                    {
                        instance = service.getInstance(ctx);
                        break;
                    }
                case ServicesType.PerRequest:
                    {
                        if (!service.instances)
                            service.instances = {};

                        if (!(ctx.guid in service.instances)) {
                            service.instances[ctx.guid] = service.getInstance(ctx);

                            if (!(ctx.guid in this._requestCache))
                                this._requestCache[ctx.guid] = [];

                            this._requestCache[ctx.guid].push(service);
                        }

                        instance = service.instances[ctx.guid];
                        break;
                    }
            }

            return instance;
        }

        public release(ctxGuid: string): void {
            if (ctxGuid in this._requestCache) {
                for (var i = 0, s: IServices; s = this._requestCache[ctxGuid][i]; i++) {
                    delete s.instances[ctxGuid];
                }
                delete this._requestCache[ctxGuid];
            }
        }
    }

    class ErrorNotFound implements IPipeline {
        public process(ctx: IContext, next: () => void): void {
            ctx.response.statusCode = 404;
            next();
        }
    }
}

export = internal;