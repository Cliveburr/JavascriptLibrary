import { Component, TemplateRef, ViewChild } from "@angular/core";
import { LoaderRelationSelect } from "app/core/model";
import { RelationService } from "app/core/service";
import { ILoaderFilter, ModalService } from "app/framework";

@Component({
    selector: 's-relation-select',
    templateUrl: 'relation-select.component.html'
})
export class RelationSelectComponent {

    @ViewChild('modalBody') public modalBody: TemplateRef<any>;
    private selected?: (value : LoaderRelationSelect | null) => void;
    public directFilters: ILoaderFilter[];

    public constructor(
        private modalService: ModalService,
        public relationService: RelationService
    ) {
        this.directFilters = [
            { code: 'avoids', value: [] }
        ];
    }

    public async select(title: string, avoids: string[]): Promise<LoaderRelationSelect | null> {
        this.directFilters[0].value = avoids;
        return new Promise((e, r) => {
            this.selected = e;
            this.modalService.showAsSelect(title, this.modalBody, e);
        });      
    }

    public onselect(item: LoaderRelationSelect): void {
        if (this.selected) {
            this.selected(item);
        }
        this.modalService.hide();
    }
}
