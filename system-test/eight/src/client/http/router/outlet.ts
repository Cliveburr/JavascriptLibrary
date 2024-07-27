import { SNode } from "../dom/snode";
import { INavContext, IRoute } from "./models";

export class RouteOutlet {
    
    public isOutLet = true;

    public static injector = ['snode'];
    constructor(
        private snode: SNode
    ) {
        delete snode.tag;
    }

    public async applyRoute(route: IRoute, context: INavContext): Promise<SNode> {
        try {
            await this.snode.childs.set([{ code: route.code }]);
        }
        catch (err) {
            console.error('Error navigation: ', err);
        }
        return this.snode.childs.get(0)!;
    }
}