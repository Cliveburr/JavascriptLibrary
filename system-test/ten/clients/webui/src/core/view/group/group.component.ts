import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { LiCollectionComponent, makeProfileResolve } from 'app/framework';
import { GroupService } from '../../service';
import { GroupMemberType, ProfileGroupMemberModel, ProfileGroupResolve } from '../../model';
import { ConfirmByTextComponent, GroupSelectComponent, RelationSelectComponent } from '../../component';

@Component({
    templateUrl: 'group.component.html'
})
export class GroupComponent {

    public model: ProfileGroupResolve;
    public formGroup: FormGroup;
    public tab: number;
    @ViewChild('members') public members: LiCollectionComponent;
    @ViewChild('groupSelect') public groupSelect: GroupSelectComponent;
    @ViewChild('relationSelect') public relationSelect: RelationSelectComponent;
    @ViewChild('confirmByText') public confirmByText: ConfirmByTextComponent;

    public constructor(
        private groupService: GroupService,
        private route: ActivatedRoute
    ) {
        this.tab = 0;
        this.formGroup = new FormGroup({});
        this.model = route.snapshot.data.resolved;
    }

    public async saveGroup(): Promise<void> {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) {
            return;
        }
        await this.groupService.base.withLoadingNavNotify(
            this.groupService.saveProfileGroup(this.model.group),
            'Grupo salvo com sucesso!',
            [ this.route, ':profile/groups' ]
        );
    }

    public remove_member(member: ProfileGroupMemberModel): void {
        const index = this.model.group.members
            .indexOf(member);
        this.model.group.members.splice(index, 1);
        this.members.refresh();
    }

    public async add_member(): Promise<void> {
        const avoids = [this.model._id].concat(this.model.group.members
            .filter(m => m.type == GroupMemberType.IsRelation)
            .map(m => m._id));
        const member = await this.relationSelect.select('Selecionar Relação', avoids);
        if (member) {
            this.model.group.members.push({
                _id: member._id,
                type: GroupMemberType.IsRelation,
                name: member.name,
                portrait: member.portrait
            });
            this.members.refresh();
        }
    }

    public async add_group(): Promise<void> {
        const avoids = [this.model.group._id].concat(this.model.group.members
            .filter(m => m.type == GroupMemberType.IsGroup)
            .map(m => m._id));
        const member = await this.groupSelect.select('Selecionar Grupo', avoids);
        if (member) {
            member.type = GroupMemberType.IsGroup;
            this.model.group.members.push(member);
            this.members.refresh();
        }        
    }

    public async deleteGroup(): Promise<void> {
        const result = await this.confirmByText.confirm('Confirma deletar grupo', this.model.group.name, `Para deletar o grupo '${this.model.group.name}', repita o nome do grupo!`);
        if (result) {
            await this.groupService.base.withLoadingNavNotify(
                this.groupService.delete(this.model.group._id),
                'Grupo deletado com sucesso!',
                [ this.route, ':profile/groups' ]
            );
        }
    }
}

export const ProfileGroupPath = makeProfileResolve(
    ':profile/group/:id',
    GroupComponent,
    GroupService,
    'resolveProfileGroup',
    'id'
);

