import { Injectable, ModuleHotImport } from 'providerjs';
import { WS_PATH_LOADER_PROVIDER, IPathLoader } from '../websocket';

export interface IPathRoute {
    areaName: string;
    areaRequire: string;
    areaLoad: string;
    hubs: Array<{
        hubName: string;
        hubLoad: string;
    }>;
}

export interface IPathCache {
    areaName: string;
    areaObj: any;
    hubs: Array<{
        hubName: string;
        hubObj: any;
    }>;
}

const paths: IPathRoute[] = [
    { areaName: 'core', areaRequire: '@seven/core', areaLoad: 'CoreModule', hubs: [
        { hubName: 'login', hubLoad: 'LoginBusiness' },
        { hubName: 'profile', hubLoad: 'ProfileBusiness' },
        { hubName: 'relation', hubLoad: 'RelationBusiness' },
        { hubName: 'group', hubLoad: 'GroupBusiness' },
        { hubName: 'security', hubLoad: 'SecurityBusiness' }
    ] }
]

@Injectable({
    identity: WS_PATH_LOADER_PROVIDER
})
export class MainLoader implements IPathLoader {
    
    //private areaModules: { [area: string]: (name: string) => Object | undefined };
    private areas: IPathCache[];

    public constructor(
        private hotload: ModuleHotImport
    ) {
        //this.areaModules = {};
        this.areas = [];
    }

    public getPath(pathName: string): Object {
        const pathParts = pathName.split('.');

        if (pathParts.length != 2) {
            throw 'Invalid path: ' + pathName;
        }

        const areaName = pathParts[0]!;
        const hubName = pathParts[1]!;

        const area = this.getArea(areaName);
        const hub = this.getHub(area, hubName);
        return hub;
    }

    private getArea(name: string): IPathCache {
        const cached = this.areas
            .find(a => a.areaName == name);
        if (cached) {
            return cached;
        }
        else {
            const has = paths
                .find(p => p.areaName == name);
            if (!has) {
                throw 'Invalid area: ' + name;
            }

            const areaObj = require(has.areaRequire);
            this.hotload.import(areaObj[has.areaLoad]);
            const pathCache: IPathCache = {
                areaName: name,
                areaObj,
                hubs: []
            }
            this.areas.push(pathCache);
            return pathCache;
        }
    }

    private getHub(area: IPathCache, name: string): Object {
        const cached = area.hubs
            .find(h => h.hubName == name);
        if (cached) {
            return cached.hubObj;
        }
        else {
            const hasArea = paths
                .find(p => p.areaName == area.areaName);
            if (!hasArea) {
                throw 'Invalid area: ' + name;
            }
            const hasHub = hasArea.hubs
                .find(h => h.hubName == name);
            if (!hasHub) {
                throw `Invalid hub "${name}" for area "${area.areaName}"`;
            }
            const hub = area.areaObj[hasHub.hubLoad];
            const hubCache = {
                hubName: name,
                hubObj: hub
            }
            area.hubs.push(hubCache);
            return hubCache.hubObj;
        }
    }

    // private getArea(name: string): ((name: string) => Object | undefined) | undefined {
    //     if (!this.areaModules[name]) {
    //         try {
    //             switch (name) {
    //                 case 'core': {
    //                     this.loadArea(name, '@seven/core', 'CoreBusiness'); // '../core/core.module.js');
    //                     break;
    //                 }
    //                 case 'app': {
    //                     this.loadArea(name, '../app/app.module.js');
    //                     break;
    //                 }
    //                 case 'comm': {
    //                     this.loadArea(name, '../apps/commission-control/commission-control.module.js');
    //                     break;
    //                 }
    //                 default: return undefined;
    //             }
    //         }
    //         catch (err) {
    //             console.error(err);
    //         }
    //     }
    //     return this.areaModules[name];
    // }

    // private loadArea(name: string, path: string, moduleName: string): void {
    //     try {
    //         const coreModule = require(path);
    //         this.hotload.import(coreModule.default);
    //         this.areaModules[name] = coreModule.getPath;
    //     }
    //     catch (err) {
    //         console.error(err);
    //     }
    //}
}
