import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileSelectApi } from 'src/core';
import { IRelationService, LoaderProfileRelationsModel, ProfileRelationsResolve, RelationState, RelationType } from 'src/core/service';
import { CoreModalService } from 'src/core/service';
import { BaseService, routeResolve, ViewCollectionComponent } from 'src/framework';
// import { ProfileRelationsItem, ProfileRelationsModel, RelationState, RelationType } from 'app/core/model';
// import { RelationService } from 'app/core/service';
// import { CardCollectionComponent, makeProfileResolve } from 'app/framework';

enum IItemActionType {
    Accept = 0,
    Cancel = 1,
    Edit = 2
}

@Component({
    templateUrl: './relations.component.html'
})
export class RelationsComponent {

    public model: ProfileRelationsResolve;
    @ViewChild('collection') collection!: ViewCollectionComponent;

    public stateFilter = [
        { value: 0, display: 'Todos', default: true },
        { value: 1, display: 'Para Aceitar' },
        { value: 2, display: 'Cancelado' }
    ];
    public stateFiterValue: number = 0;

    public constructor(
        private baseService: BaseService,
        public relationService: IRelationService,
        private coreModalService: CoreModalService,
        route: ActivatedRoute
    ) {
        this.model = route.snapshot.data['resolved'].model;
    }

    public async requestRelation(): Promise<void> {
        const profile = await this.coreModalService.profileSelect(ProfileSelectApi.loaderProfilesForRelations);
        if (profile) {
            await this.baseService.withLoadingNotify(
                this.relationService.requestRelation(profile._id),
                'Relação solicitada!'
            );
            this.collection.refresh();
        }
    }

    public getItemActionType(item: LoaderProfileRelationsModel): IItemActionType {
        if (item.type == RelationType.Out) {
            return IItemActionType.Edit
        }
        else {
            switch (item.state) {
                case RelationState.ToAccept:
                    return IItemActionType.Accept;
                default:
                    return IItemActionType.Cancel;
            }
        }
    }

    public async accept_click(item: LoaderProfileRelationsModel): Promise<void> {
        await this.baseService.withLoadingNotify(
            this.relationService.acceptRelation(item.realProfileId),
            'Relação estabelecida!'
        );
        this.collection.refresh();
    }

    public async cancel_click(item: LoaderProfileRelationsModel): Promise<void> {
        await this.baseService.withLoadingNotify(
            this.relationService.cancelRelation(item.realProfileId),
            'Relação cancelada!', 'warning'
        );
        this.collection.refresh();
    }
}

export const ProfileRelationsPath = routeResolve(
    ':profile/relations',
    RelationsComponent,
    IRelationService,
    'resolveProfileRelations'
);
