/// <reference path="../Extenders.ts"/>
require('../Extenders');
import http = require('http');
import system = require('../System');

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
        new (...params: any[]): any;
    }

    export interface IServices {
        name: string;
        type: ServicesType;
        instances?: any;
        getInstance: (ctx: IContext) => any;
        on_create?: system.Event<(service: any) => void>;
        on_destroy?: system.Event<(service: any) => void>;
    }

    export interface IServicesType {
        new (): IServices;
    }

    export interface IServicesFluent<T> {
        on(service: (service: T) => void): IServicesFluent<T>;
        off(service: (service: T) => void): IServicesFluent<T>;
    }

    export interface IConfigureServices {
        httpServer: Server;
        add<T>(service: IServicesType): IServicesFluent<T>;
        addSingleton<T>(name: string, service: IServicesDirectlyType): IServicesFluent<T>;
        addLocal<T>(name: string, service: IServicesDirectlyType): IServicesFluent<T>;
        addPerRequest<T>(name: string, service: IServicesDirectlyType): IServicesFluent<T>;
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

    export class Server implements IServices {
        public httpServer: http.Server;
        public rootApp: string;
        public wwwroot: string;
        public logErrorOnConsole: boolean;
        public name: string;
        public type: ServicesType;
        public instances: this;

        private _pipe: IPipelineType[];
        private _injector: Injector;
        private _contexts: system.AutoDictonary<IContext>;

        constructor(configs: IServerConfigs) {
            var that = this;
            this.rootApp = configs.rootApp;
            this.wwwroot = configs.wwwroot;
            this.logErrorOnConsole = true;
            this._pipe = [];
            this.name = 'server';
            this.type = ServicesType.Singleton;
            this.instances = this;
            this._injector = new Injector();
            this._injector.add(this);
            this._contexts = new system.AutoDictonary<IContext>('asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM0123456789', 10);
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
                if (this.logErrorOnConsole)
                    console.log(err);

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
            configure(<any>{
                httpServer: this,
                add: (services) => this.services_add(services),
                addSingleton: (name, service) => this.add_directly(name, service, ServicesType.Singleton),
                addLocal: (name, service) => this.add_directly(name, service, ServicesType.Local),
                addPerRequest: (name, service) => this.add_directly(name, service, ServicesType.PerRequest)
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

        private services_add<T extends IServices>(service: IServicesType): IServicesFluent<T> {
            var newService = new service();

            this._injector.add(newService);

            var fluent = {
                on: (callBack) => {
                    if (newService.on_create)
                        newService.on_create.add(callBack);
                    return fluent;
                },
                off: (callBack) => {
                    if (newService.on_destroy)
                        newService.on_destroy.add(callBack);
                    return fluent;
                }
            };

            return fluent;
        }

        private add_directly<T extends IServices>(name: string, service: IServicesDirectlyType, type: ServicesType): IServicesFluent<T> {
            var that = this;

            var newService: IServices = {
                name: name,
                type: type,
                getInstance: (ctx) => {
                    var instance = that._injector.make(ctx, service)
                    if (newService.on_create)
                        newService.on_create.raise(instance);
                    return instance;
                },
                on_create: new system.Event<(service: any) => void>(),
                on_destroy: new system.Event<(service: any) => void>()
            };

            this._injector.add(newService);

            var fluent = {
                on: (callBack) => {
                    newService.on_create.add(callBack);
                    return fluent;
                },
                off: (callBack) => {
                    newService.on_destroy.add(callBack);
                    return fluent;
                }
            };

            return fluent;
        }

        public getInstance(ctx: IContext): this {
            return this.instances;
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