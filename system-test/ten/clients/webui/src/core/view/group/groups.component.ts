import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardCollectionComponent, makeProfileResolve } from 'app/framework';
import { GroupService } from 'app/core/service';
import { ProfileGroupsResolve } from 'app/core/model';

@Component({
    templateUrl: './groups.component.html'
})
export class GroupsComponent {

    @ViewChild('cards') public cards: CardCollectionComponent;
    public model: ProfileGroupsResolve;

    public constructor(
        public groupService: GroupService,
        private route: ActivatedRoute
    ) {
        // this.meta = {
        //     apiItems: groupService.call.listLoader,
        //     filter: {
        //         cardTitle: 'Filtrar',
        //         filters: [
        //             { type: FilterItemType.text, alias: 'Name', size: 6, loader: {
        //                 type: ILoaderFilterType.Regex, property: 'name', regexPattern: '{{value}}', regexFlags: 'i'
        //             } }
        //         ]
        //     },
        //     button: {
        //         host: this,
        //         buttons: [
        //             { type: ButtonItemType.normal, name: 'Criar Grupo', event: 'createGroup', style: 'btn-primary' }
        //         ]
        //     }
        // }

        // this.meta = {
        //     groups: {
        //         onAddItem: this.groups_addItem.bind(this),
        //         doneAddItem: this.groups_doneAddItem.bind(this),
        //         onEditItem: () => {},
        //         hideEditButton: true,
        //         editMode: 'modal',
        //         modalEditTitle: 'Editar Grupo',
        //         hideExcludeButton: true,
        //         showCancelOnEdit: true,
        //         selectMode: true,
        //         selectStyle: 'border-primary',
        //         cardSize: 12,
        //         //itemStyle: 'mt-3'
        //         formGroup: this.formGroup,
        //         editGroup: groupsGroup,
        //         // validators: [ 'collectionRequiredAny' ]
        //     },
        //     groupMeta: {
        //         name: {
        //             label: 'Nome',
        //             placeholder: 'Grupo nome',
        //             class: 'col-6',
        //             formGroup: groupsGroup,
        //             validators: [ 'required' ]
        //         }
        //     },
        //     portrait: {
        //         class: 'btn'
        //     },
        //     portraitModal: {

        //     }
        // }
        this.model = route.snapshot.data.resolved;
    }

    // private groups_addItem(): GroupListModel {
    //     return {
    //         _id: <any>undefined,
    //         name: '',
    //         portrait: {
    //             type: PortraitType.TwoLetter,
    //             twoLetter: {
    //                 twoLetter: 'GP',
    //                 backColor: 'light',
    //                 borderColor: 'primary',
    //                 foreColor: 'dark'
    //             }
    //         }
    //     }
    // }

    // private async groups_doneAddItem(group: GroupListModel): Promise<void> {

    //     await this.groupService.base.loading.withPromise(
    //         this.groupService.call.create(this.nickName, group)
    //     );
    // }

    // public async edit_click(group: GroupListModel): Promise<void> {
        
    //     const result = await this.card.showEdit(group);
    //     if (result) {
    //         await this.groupService.base.loading.withPromise(
    //             this.groupService.call.update(group)
    //         );
    //     }
    // }

    // public async portrait_click(group: GroupListModel): Promise<void> {
    //     const cloned = clone(group.portrait);
    //     const result = await this.portraitModal.show(cloned!);
    //     if (result) {
    //         group.portrait = result;
            
    //         await this.groupService.base.loading.withPromise(
    //             this.groupService.call.update(group)
    //         );
    //     }
    // }

    // public exclude_click(item: GroupListModel): void {

    // }

    public groupNav(groupId: string): void {
        this.groupService.base.navigate([this.route, `:profile/group/${groupId}`]);
    }

    public createGroup(): void {

    }
}

export const ProfileGroupsPath = makeProfileResolve(
    ':profile/groups',
    GroupsComponent,
    GroupService,
    'resolveProfileGroups'
);
