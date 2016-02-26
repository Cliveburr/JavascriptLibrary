import httpServer = require('../Http/HttpServer');

module internal {
    export class identityServices implements httpServer.IServices {
        public name: string;
        public type: any;

        public configuration(config: any): void {
        }

        public getInstance(): any {
            return new identity();
        }
    }

    class identity {
    }
}

export = internal;