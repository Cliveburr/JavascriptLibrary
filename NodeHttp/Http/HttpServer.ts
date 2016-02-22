import http = require('http');

module internal {
    export interface IPipeline {
        process(pipeInfo: IPipeInfo): void;
    }

    export interface IPipelineType {
        new (): IPipeline;
    }

    export interface IPipeInfo {
        alreadyProcess: boolean;
        server: Server;
        request: http.IncomingMessage;
        response: http.ServerResponse;
    }

    export interface IConfigureServices {
        httpServer: Server;
    }

    export interface IConfigure {
        use(pipe: IPipelineType): void;
        useErrorNotFound(): void;
    }

    export interface IServerConfigs {
        rootApp: string;
    }

    export class Server {
        public httpServer: http.Server;
        public rootApp: string;
        private _pipe: IPipeline[];

        constructor(configs: IServerConfigs) {
            var that = this;
            this.rootApp = configs.rootApp;
            this._pipe = [];
            this.httpServer = http.createServer((req, res) => that.handleRequest(req, res));
        }

        private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
            var pipeInfo: IPipeInfo = {
                alreadyProcess: false,
                server: this,
                request: req,
                response: res
            };

            try {
                for (var i = 0, pipe: IPipeline; pipe = this._pipe[i]; i++) {
                    pipe.process(pipeInfo);
                    if (pipeInfo.alreadyProcess)
                        break;
                }
            }
            catch (err) {
                pipeInfo.response.statusCode = 500;
            }

            res.end();
        }

        public configureServices(configure: (services: IConfigureServices) => void): void {
            configure({
                httpServer: this
            });
        }

        public configure(configure: (app: IConfigure) => void): void {
            var that = this;
            configure({
                use: (pipe) => that.pipe_use(pipe),
                useErrorNotFound: () => that.pipe_use(ErrorNotFound)
            });
        }

        public listen(port: number): void {
            this.httpServer.listen(port);
        }

        private pipe_use(pipe: IPipelineType): void {
            this._pipe.push(new pipe());
        }
    }

    export class ErrorNotFound implements IPipeline {
        public process(pipeInfo: IPipeInfo): void {
            pipeInfo.response.statusCode = 400;
        }
    }
}

export = internal;