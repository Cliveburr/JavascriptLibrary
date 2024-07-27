import { Injectable } from '@angular/core';
import { BaseService, ILoaderRequest, ILoaderResponse, IPath, WebSocketService } from '../../framework';
import { GroupListModel, ProfileGroupModel, ProfileGroupsResolve } from '../model';

@Injectable()
export class GroupService {

    private ws: IPath;

    public constructor(
        public base: BaseService,
        webSocketService: WebSocketService
    ) {
        this.ws = webSocketService.openPath('core.group');
    }

    public resolveProfileGroups(): Promise<ProfileGroupsResolve> {
        return this.ws.call('resolveProfileGroups');
    }

    public loaderProfileGroups(request: ILoaderRequest): Promise<ILoaderResponse> {
        return this.ws.call('loaderProfileGroups', request);
    }

    public resolveProfileGroup(groupId: string): Promise<ProfileGroupsResolve> {
        return this.ws.call('resolveProfileGroup', groupId);
    }
    
    public saveProfileGroup(model: ProfileGroupModel): Promise<void> {
        return this.ws.call('saveProfileGroup', model);
    }

    public update(model: GroupListModel): Promise<void> {
        return <any>undefined;
    }

    public delete(groupId: string): Promise<void> {
        return this.ws.call('delete', groupId);
    }
}