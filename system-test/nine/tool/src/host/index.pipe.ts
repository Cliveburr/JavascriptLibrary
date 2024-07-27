import { OutgoingHttpHeaders } from 'http';
import path from 'path';
import fs from 'fs';
import { IPipeline, IContext } from "webhost";

export abstract class IndexPipe implements IPipeline {

    private headers?: OutgoingHttpHeaders;
    private content?: string;

    protected abstract configurate(content: string): string;

    public process(ctx: IContext, next: () => void): void {

        let isAjax = ctx.request.headers['x-requested-with'] == 'XMLHttpRequest';
        if (ctx.request.url == '/boot.js') {
            
            const filePath = path.resolve(__dirname, '../client/boot.js');
            ctx.response.writeHead(200, {
                'Content-Type': 'text/javascript'
            });
            ctx.response.write(fs.readFileSync(filePath));
            ctx.processed = true;
        }
        else if (!isAjax) {

            if (!this.content && !this.headers) {
                this.buildContent(ctx);
            }

            ctx.response.writeHead(200, this.headers);
            ctx.response.write(this.content);
            ctx.processed = true;
        }
        next();
    }

    private buildContent(ctx: IContext): void {

        if (global.tool.arguments.command == 'server') {
            const appRoot = ctx.serverValues.get('approot');
            const filePath = path.resolve(appRoot, '../src/pages/index.html');
            this.content = this.configurate(fs.readFileSync(filePath).toString());
            this.headers = {
                'Content-Type': 'text/html'
            }
        }
        else {
            throw 'Not implemented tool command!';
        }
    }
}