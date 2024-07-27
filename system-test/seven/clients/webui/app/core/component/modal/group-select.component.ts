import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ProfileGroupMemberModel } from "app/core/model";
import { GroupService } from "app/core/service";
import { ILoaderFilter, ModalService } from "app/framework";

@Component({
    selector: 's-group-select',
    templateUrl: 'group-select.component.html'
})
export class GroupSelectComponent {

    @ViewChild('modalBody') public modalBody: TemplateRef<any>;
    private selected?: (value : ProfileGroupMemberModel | null) => void;
    public directFilters: ILoaderFilter[];

    public constructor(
        private modalService: ModalService,
        public groupService: GroupService
    ) {
        this.directFilters = [
            { code: 'avoids', value: [] }
        ];
    }

    public async select(title: string, avoids: string[]): Promise<ProfileGroupMemberModel | null> {
        this.directFilters[0].value = avoids;
        return new Promise((e, r) => {
            this.selected = e;
            this.modalService.showAsSelect(title, this.modalBody, e);
        });      
    }

    public onselect(item: ProfileGroupMemberModel): void {
        if (this.selected) {
            this.selected(item);
        }
        this.modalService.hide();
    }
}
