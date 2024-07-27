import { IPathInstanceData, IPathProvider } from "../http/ws/models";

export interface IPaths {
    path: string,
    cls?: any,
    childs?: IPaths[];
}

export class PathProvider implements IPathProvider {

    private guids: { [guid: string]: { [path: string]: any } };

    public constructor(
        private paths: IPaths[]
    ) {
        this.guids = {};
    }

    public getPath(guid: string, path: string): any {
        const hasGuid = this.guids[guid];
        if (hasGuid) {
            return hasGuid[path];
        }
    }

    private resolvePath(path: string): any {
        const parts = path.split('.');
        let cPaths = this.paths;
        let res: any = undefined;
        for (const part of parts) {
            const has = cPaths.find(p => p.path == part);
            if (has) {
                res = has.cls;
                cPaths = has.childs || [];
            }
            else {
                return undefined;
            }
        }
        return res;
    }

    public instancePath(data: IPathInstanceData): any {
        const guid = this.guids[data.guid] ||= {};
        const pathCls = this.resolvePath(data.path);
        if (pathCls) {
            return guid[data.path] = new pathCls(data.call, data.session, data.callAll);
        }
    }

    public clear(guid: string): void {
        const hasGuid = this.guids[guid];
        if (hasGuid) {
            for (const path in hasGuid) {
                delete hasGuid[path];
            }
            delete this.guids[guid];
        }
    }
}