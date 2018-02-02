import { IPipeline, IContext } from 'webhost';
import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'url';

export class Es6Adapter implements IPipeline {
    public process(ctx: IContext, next: () => void): void {
        let isAjax = ctx.request.headers['x-requested-with'] == 'XMLHttpRequest';
        let pathname = parse(ctx.request.url).pathname;

        if (isAjax) {
            this.ES6Adapter(ctx, pathname);
        }
        else {
            if (!this.ES6Adapter(ctx, pathname)) {
                ctx.request.url = '/index.html';
            }
        }

        next();
   }

    private ES6Adapter(ctx: IContext, pathname: string): boolean {
        let file = path.resolve(ctx.server.wwwroot + pathname);

        if (this.fileExists(file)) {
            return true;
        }
        else {
            let fileJs = file + '.js';
            if (this.fileExists(fileJs)) {
                ctx.request.url += '.js';
                return true;
            }
        }
        return false;
    }

    private fileExists(file: string): boolean {
        try {
            let stat = fs.statSync(file);
            return stat.isFile();
        }
        catch {
            return false;
        }
    }
}