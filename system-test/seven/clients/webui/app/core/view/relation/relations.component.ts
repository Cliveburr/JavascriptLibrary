import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileRelationsItem, ProfileRelationsModel, RelationState, RelationType } from 'app/core/model';
import { RelationService } from 'app/core/service';
import { CardCollectionComponent, makeProfileResolve } from 'app/framework';

enum IItemActionType {
    Accept = 0,
    Cancel = 1,
    Edit = 2
}

@Component({
    templateUrl: './relations.component.html'
})
export class RelationsComponent {

    public model: ProfileRelationsModel;
    @ViewChild('cards') cards: CardCollectionComponent;

    public stateFilter = [
        { value: 0, display: 'Todos', default: true },
        { value: 1, display: 'Para Aceitar' },
        { value: 2, display: 'Cancelado' }
    ];
    public stateFiterValue: number = 0;

    public constructor(
        public relationService: RelationService,
        route: ActivatedRoute
    ) {
        this.model = route.snapshot.data.resolved;
    }

    public getItemActionType(item: ProfileRelationsItem): IItemActionType {
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

    public async accept_click(item: ProfileRelationsItem): Promise<void> {
        await this.relationService.base.withLoadingNotify(
            this.relationService.acceptRelation(item.realProfileId),
            'Relação estabelecida!'
        );
        this.cards.refresh();
    }

    public async cancel_click(item: ProfileRelationsItem): Promise<void> {
        await this.relationService.base.withLoadingNotify(
            this.relationService.cancelRelation(item.realProfileId),
            'Relação cancelada!', 'warning'
        );
        this.cards.refresh();
    }
}

export const ProfileRelationsPath = makeProfileResolve(
    ':profile/relations',
    RelationsComponent,
    RelationService,
    'resolveProfileRelations'
);
