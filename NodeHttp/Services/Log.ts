import httpServer = require('../Http/HttpServer');
import fs = require('fs');

module internal {

    export class LogServices {
        public output: string;

        public write(text: string): void {
            fs.appendFileSync(this.output, text);
        }

        public writeLine(text: string): void {
            fs.appendFileSync(this.output, text + '\r\n');
        }
    }
}

export = internal;