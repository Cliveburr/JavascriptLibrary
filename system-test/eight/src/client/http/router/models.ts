
export const MakeJs = ''; //TODO: isso faz com que ele produz o .js e não da erro no index.ts export

export interface IRoute {
    route: string;
    code: any;
    redirect?: string;
}

export interface INavContext {
    rootNav: SNode;
    canceled: boolean;
    parts: string[];
    lasts: string[];
    routes: IRoute[];
}
