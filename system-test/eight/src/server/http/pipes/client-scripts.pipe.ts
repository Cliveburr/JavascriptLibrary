import { IPipeline, IRequestContext } from "../models";

export class ClientScript implements IPipeline {
     
    public constructor(
        private path: string
    ) {
    }

    public process(ctx: IRequestContext, next: () => void): void {
        if (ctx.req.url) {
            if (ctx.req.url.startsWith('/node_modules')) {
                ctx.req.url = '/../..' + ctx.req.url;
            }
            else if (ctx.req.url.startsWith('/src/client/')) {
                ctx.req.url = ctx.req.url.replace('/src/client/', '/');
            }
            if (ctx.req.url.endsWith('.js') || ctx.req.url.endsWith('.js.map')) {
                ctx.req.url = this.path + ctx.req.url;
            }
        }
        next();
    }
}