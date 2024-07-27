import { IPipeline, IRequestContext } from "../http";
import { parse } from 'url';
import { Application } from "./application";

export class ApplicationPipe implements IPipeline {

    public constructor(
        private app: Application
    ) {
    }

    public process(ctx: IRequestContext, next: () => void): void {
       
       const isAjax = ctx.req.headers['x-requested-with'] == 'XMLHttpRequest';
        if (!isAjax) {
            const index = this.app.buildIndex();
            ctx.res.write(index);
            ctx.processed = true;
        }

        next();
   }
}