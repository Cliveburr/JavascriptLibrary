import * as http from 'http';
import { Dictionary, GuidDictionary } from "../helpers";
import { DefaultDiagnostic } from './diagnostic-default';
import { IDiagnostic, IHostData, IPipeline, IPipelineCtr, IPipelineDelegate, PipelineType, IRequestContext } from "./models";

export class Host {

    public httpServer: http.Server;
    public diagnostic: IDiagnostic;
    private pipes: PipelineType[];
    private serverValues: Dictionary<any>;
    private contexts: GuidDictionary<IRequestContext>;
    private handleRequestBind?: (...args: any[]) => void;

    public constructor(
        private data: IHostData
    ) {
        this.serverValues = new Dictionary();
        this.contexts = new GuidDictionary();
        this.pipes = this.data.pipes || [];
        this.setServerValues();
        this.diagnostic = this.setDiagnostic();
        this.httpServer = this.prepareServer();
    }

    private setServerValues(): void {
        const propsFromData: ['approot', 'wwwroot'] = ['approot', 'wwwroot'];
        for (let prop of propsFromData) {
            if (this.data[prop]) {
                this.serverValues.set(prop, this.data[prop]);    
            }
        }
    }

    private setDiagnostic(): IDiagnostic {
        return this.diagnostic = this.data.diagnostic || new DefaultDiagnostic(this.data.diagnosticLevel);
    }

    private prepareServer(): http.Server {
        if (global.host) {
            const http = global.host.httpServer;
            http.off('request', global.host.handleRequestBind);
            delete global.host;
            return http;
        }
        else {
            return http.createServer();
        }
    }

    public start(): void {
        this.handleRequestBind = this.handleRequest.bind(this);
        this.httpServer.on('request', this.handleRequestBind);
        global.host = {
            httpServer: this.httpServer,
            handleRequestBind: this.handleRequestBind
        };
        const port = this.data.port || 1338;
        if (!this.httpServer.listening) {
            this.httpServer.listen(port);
        }
        console.log('Server started: http://localhost:' + port);
    }

    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
        const ctx: IRequestContext = {
            guid: '',
            processed: false,
            req,
            res,
            serverValues: this.serverValues,
            values: new Dictionary(),
            log: this.diagnostic.log.bind(this.diagnostic)
        };
        ctx.guid = this.contexts.autoSet(ctx);
        this.processPipe(ctx, 0);
    }

    private processPipe(ctx: IRequestContext, index: number): void {
        try {
            const pipe =  this.pipes ? this.pipes[index] : undefined;
            if (pipe && !ctx.processed) {
                if ('process' in (pipe as IPipeline)) {
                    (pipe as IPipeline).process(ctx, this.processPipe.bind(this, ctx, index + 1));
                }
                else if ((pipe as IPipelineCtr).prototype) {
                    const inst = typeof (pipe as IPipelineCtr).instance != 'undefined' ?
                        (pipe as IPipelineCtr).instance!(ctx) :
                        new (pipe as IPipelineCtr)();
                    inst.process(ctx, this.processPipe.bind(this, ctx, index + 1));
                }
                else {
                    (pipe as IPipelineDelegate)(ctx, this.processPipe.bind(this, ctx, index + 1));
                }
            }
            else {
                ctx.res.end();
                this.contexts.remove(ctx.guid);
            }
        }
        catch (err) {
            this.diagnostic.log(err, 1);
            ctx.res.statusCode = 500;
            ctx.res.write(JSON.stringify(err));
            ctx.res.end();
            this.contexts.remove(ctx.guid);
        }
    }
}