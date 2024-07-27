import { INavContext, IRoute } from "./models";

export class Routes {

    public static injector = ['data'];
    constructor(
        private routes: IRoute[]
    ) {
    }

    public compare(disc: INavContext): IRoute | undefined {
        const part = disc.lasts[0];
        for (const route of this.routes) {
            if (route.route == part) {
                return route;
            }
        }
        return undefined;
    }
}