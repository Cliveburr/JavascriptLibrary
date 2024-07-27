import { Injectable } from '@angular/core';
import { BaseService, ILoaderRequest, ILoaderResponse, IPath, WebSocketService } from '../../framework';

@Injectable()
export class AppsService {

    private apps: IPath;

    public constructor(
        public base: BaseService,
        webSocketService: WebSocketService
    ) {
        this.apps = webSocketService.openPath('app.apps');
    }

    public getApps(request: ILoaderRequest): Promise<ILoaderResponse> { return <any>undefined; }
    public install(prototypeId: string): Promise<void> { return <any>undefined; }
}