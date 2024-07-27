import { Component, OnInit, Input, HostBinding, TemplateRef, ViewChild } from '@angular/core';
import { ILiCollectionSelectModalInput, CollectionItemStatus, ICollectionItem } from '../../../model';
import { GlobalId } from '../../../helpers';
import { BaseCollectionInputComponent } from './base-collection-input';
import { LiCollectionModalInputComponent } from '../modal/li-collection-modal-input.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 's-li-collection-select-modal-input',
    templateUrl: 'li-collection-select-modal-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: LiCollectionSelectModalInputComponent, multi: true }
    ]
})
export class LiCollectionSelectModalInputComponent<V, S> extends BaseCollectionInputComponent<ICollectionItem<V>, ILiCollectionSelectModalInput<V, S>> implements OnInit {

    @Input() public listView: TemplateRef<any>;
    @ViewChild('modal') public modal: LiCollectionModalInputComponent<S>;
    @HostBinding('class') public hostClass: string;

    public constructor(
    ) {
        super()
    }

    public ngOnInit(): void {
        this.prepareMeta();
        this.customControlForm();
        this.prepareSelectedMode();
    }

    private prepareMeta(): void {
        this.inMeta.id ||= GlobalId.generateNewId();
        if (this.inMeta.modal && this.inMeta.modal.collection) {
            this.inMeta.modal.collection.dontRefresheAtStart = true;
            this.inMeta.modal.collection.selectMode = true;
            this.inMeta.modal.collection.pageLimit ||= 15;
        }
        this.hostClass = 'form-group ' + this.inMeta.class;
    }

    private customControlForm(): void {
        this.setControlForm(this.inMeta.validators);
    }

    public onValueChanged(): void {
        if (this.inValidator) {
            this.inValidator.formControl.setValue(this.value);
        }
    }

    public getItemsToShow(): ICollectionItem<V>[] {
        return (this.value || [])
            .filter(i => i.status != CollectionItemStatus.remove);
    }

    public async add_click(): Promise<void> {
        if (this.checkForSelectGroup()) {
            return;
        }
        const valueSelected = await this.modal.show(null);
        if (!valueSelected) {
            this.inValidator.formControl.markAsTouched();
            return;
        }
        const newItem = {
            value: this.inMeta.onAddItem!(valueSelected),
            status: CollectionItemStatus.create
        }
        this.value!.push(newItem);
        this.inValidator.formControl.updateValueAndValidity();
        this.setSelected(newItem);
    }

    public async edit_click(item: ICollectionItem<V>): Promise<void> {
        if (this.checkForSelectGroup()) {
            return;
        }
        const valueSelected = await this.modal.show(null);
        if (!valueSelected) {
            return;
        }
        item.status = CollectionItemStatus.update;
        this.inMeta.onEditItem!(item.value!, valueSelected);
    }

    public exclude_click(item: ICollectionItem<V>): void {
        if (item.status == CollectionItemStatus.create) {
            const index = this.value!.indexOf(item);
            this.value!.splice(index, 1);
        }
        else {
            item.status = CollectionItemStatus.remove;
        }
        if (this.inSelected === item) {
            this.setSelected(undefined);
        }
        this.inValidator.formControl.updateValueAndValidity();
    }
}