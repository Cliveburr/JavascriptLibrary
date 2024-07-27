import { IPipeline, IRequestContext } from "../models";

export class DefaultFiles implements IPipeline {
     
    public process(ctx: IRequestContext, next: () => void): void {
        if (ctx.req.url == '/') {
            ctx.req.url = '/index.html';
        }
        next();
    }
}