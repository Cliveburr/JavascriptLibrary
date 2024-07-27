import { IPipeline, IRequestContext } from "../models";
import { parse } from 'url';

export class SpaPipe implements IPipeline {

    public process(ctx: IRequestContext, next: () => void): void {
       
       let isAjax = ctx.req.headers['x-requested-with'] == 'XMLHttpRequest';
       let pathname = parse(ctx.req.url || '').pathname || '';
       if (!isAjax && pathname.indexOf('.') == -1) {
        //    let indexFile = ctx.serverValues.get('indexFile');
        //    ctx.req.url = '/' + indexFile;
            ctx.req.url = '/index.html';
       } 
       next();
   }
}