import { Injectable } from '@angular/core';
import { BaseService, ILoaderRequest, ILoaderResponse, IPath, WebSocketService } from '../../framework';
import { RelationOutModel, LoaderRelationSelect } from '../model';

@Injectable()
export class RelationService {

    private ws: IPath;

    public constructor(
        public base: BaseService,
        webSocketService: WebSocketService
    ) {
        this.ws = webSocketService.openPath('core.relation');
    }

    public requestRelation(realProfileId: string): Promise<void> {
        return this.ws.call('requestRelation', realProfileId);
    }

    public resolveProfileRelations(): Promise<void> {
        return this.ws.call('resolveProfileRelations');
    }

    public loaderProfileRelations(request: ILoaderRequest): Promise<ILoaderResponse> {
        return this.ws.call('loaderProfileRelations', request);
    }

    public acceptRelation(realProfileId: string): Promise<void> {
        return this.ws.call('acceptRelation', realProfileId);
    }

    public cancelRelation(realProfileId: string): Promise<void> {
        return this.ws.call('cancelRelation', realProfileId);
    }

    public resolveProfileRelation(relationId: string): Promise<any> {
        return this.ws.call('resolveProfileRelation', relationId);
    }

    public saveProfileRelation(model: RelationOutModel): Promise<void> {
        return this.ws.call('saveProfileRelation', model);
    }

    public relationProfileSelect(request: ILoaderRequest): Promise<ILoaderResponse> {
        return this.ws.call<any>('relationProfileSelect', request);
    }
}