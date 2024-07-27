import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RelationService } from 'app/core/service';
import { makeProfileResolve } from 'app/framework';
import { FormGroup } from '@angular/forms';
import { RelationOutResolve } from 'app/core/model';

@Component({
    templateUrl: './relation.component.html'
})
export class RelationComponent {

    public model: RelationOutResolve;
    public formGroup: FormGroup;
    public activeOptions = [
        { value: true, display: 'Ativo', default: true },
        { value: false, display: 'Desativo' }
    ]

    public constructor(
        private relationService: RelationService,
        private route: ActivatedRoute
    ) {
        this.formGroup = new FormGroup({});
        this.model = route.snapshot.data.resolved;
    }

    public async saveRelationOut(): Promise<void> {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) {
            return;
        }
        await this.relationService.base.withLoadingNavNotify(
            this.relationService.saveProfileRelation(this.model.relation),
            'Relação salva com sucesso!',
            [ this.route, ':profile/relations' ]
        );
    }

}

export const ProfileRelationPath = makeProfileResolve(
    ':profile/relation/:id',
    RelationComponent,
    RelationService,
    'resolveProfileRelation',
    'id'
);

