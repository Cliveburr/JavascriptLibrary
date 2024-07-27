import { IPipeline, IRequestContext } from "../models";

export class NotFound implements IPipeline {
    
    public process(ctx: IRequestContext, next: () => void): void {
        ctx.res.statusCode = 404;
        ctx.processed = true;
        next();
    }
}