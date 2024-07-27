import { ISNode } from "../dom/models";
import { SNode } from "../dom/snode";
import { INavContext } from "./models";
import { RouteOutlet } from "./outlet";
import { Routes } from "./routes";

export class Router {

    public constructor() {
    }

    public async boot(...nodes: Array<SNode | ISNode>): Promise<void> {

        const fakeBody = await SNode.create();
        await fakeBody.childs.set(nodes);
        await this.navigate_inner(fakeBody, window.document.location.pathname);
        const childs = fakeBody.childs.list.slice();
        fakeBody.release();
        await window.sdom!.body.childs.set(childs);
    }

    public navigate(route: string): Promise<void> {
        return this.navigate_inner(window.sdom!.body, route);
    }

    private async navigate_inner(snode: SNode, route: string): Promise<void> {
        
        const prepared = route.replace(/^[\/]+/, '');

        const context: INavContext = {
            rootNav: snode,
            canceled: false,
            parts: prepared.split('/'),
            lasts: prepared.split('/'),
            routes: []
        }

        await this.discovery(snode, context);

        if (!context.canceled) {
            window.history.pushState({}, '', route)
        }
    }

    public async discovery(snode: SNode, context: INavContext): Promise<void> {
        let next = snode;
        if (snode.code) {
            if (snode.code instanceof Routes) {
                const route = snode.code.compare(context);
                if (route) {
                    if (route.redirect) {
                        context.canceled = true;
                        this.navigate_inner(context.rootNav, route.redirect);
                        return;
                    }
                    context.routes.push(route);
                }
            }
            else if (snode.code instanceof RouteOutlet) {
                const route = context.routes.shift();
                if (route) {
                    next = await snode.code.applyRoute(route, context);
                }
            }
        }

        for (const child of next.childs) {
            await this.discovery(child, context);
        }
    }
}