import { Component, OnInit, Input, HostBinding, TemplateRef } from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { CollectionItemStatus, ILiCollectionInput, ICollectionItem } from '../../../model';
import { GlobalId } from '../../../helpers';
import { BaseCollectionInputComponent } from './base-collection-input';

enum LiStatus {
    normal = 0,
    editing = 1,
    adding = 2
}

@Component({
    selector: 's-li-collection-input',
    templateUrl: 'li-collection-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: LiCollectionInputComponent, multi: true }
    ]
})
export class LiCollectionInputComponent<V> extends BaseCollectionInputComponent<ICollectionItem<V>, ILiCollectionInput<V>> implements OnInit {

    @Input() public listView: TemplateRef<any>;
    @Input() public editView: TemplateRef<any>;
    @HostBinding('class') public hostClass: string;
    
    public status: LiStatus;

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
        this.hostClass = 'form-group ' + this.inMeta.class;
        this.changeStatus(LiStatus.normal);
    }

    private customControlForm(): void {
        const validators = this.inMeta.validators || [];
        validators.push({
            key: 'collectionStatus',
            message: 'Complete a edição!',
            validator: this.collectionStatusValidator.bind(this)
        });
        this.setControlForm(validators);
    }

    public onValueChanged(): void {
        if (this.inValidator) {
            this.inValidator.formControl.setValue(this.value);
        }
    }

    private checkForNewAction(): boolean {
        if (this.status == LiStatus.adding) {
            this.inValidator.formControl.markAllAsTouched();
            return true;
        }
        if (this.status == LiStatus.editing) {
            this.inValidator.formControl.markAllAsTouched();
            return true;
        }
        return false;
    }

    public getItemsToShow(): ICollectionItem<V>[] {
        return (this.value || [])
            .filter(i => i.status != CollectionItemStatus.remove);
    }

    public add_click(): void {
        if (this.checkForNewAction() || this.checkForSelectGroup()) {
            return;
        }
        
        const value = this.inMeta.onAddItem ?
            this.inMeta.onAddItem() :
            <V>{};

        const newItem = {
            value,
            status: CollectionItemStatus.create
        }
        this.value!.push(newItem);
        this.changeStatus(LiStatus.adding);
        this.inValidator.formControl.updateValueAndValidity();
        this.setSelected(undefined);
        this.setEditing(newItem);
    }

    public edit_click(item: ICollectionItem<V>): void {
        if (this.checkForNewAction() || this.checkForSelectGroup()) {
            return;
        }
        item.status = CollectionItemStatus.update;
        this.changeStatus(LiStatus.editing);
        this.inValidator.formControl.updateValueAndValidity();
        this.setSelected(undefined);
        this.setEditing(item);
    }

    public exclude_click(item: ICollectionItem<V>): void {
        if (this.checkForNewAction()) {
            return;
        }
        if (item.status == CollectionItemStatus.create) {
            const index = this.value!.indexOf(item);
            this.value!.splice(index, 1);
        }
        else {
            item.status = CollectionItemStatus.remove;
            console.log(item)
        }
        if (this.inSelected === item) {
            this.setSelected(undefined);
        }
        this.inValidator.formControl.updateValueAndValidity();
    }

    public conclude_click(): void {
        if (this.inMeta.editGroup) {
            this.inMeta.editGroup.markAllAsTouched();
            if (this.inMeta.editGroup.invalid) {
                return;
            }
        }
        
        if (this.status == LiStatus.editing) {
            this.inEditing!.status = CollectionItemStatus.update;
            this.inMeta.onEditItem!(this.inEditing!.value!);
        }
        this.changeStatus(LiStatus.normal);
        this.inValidator.formControl.updateValueAndValidity();
        this.setSelected(this.inEditing);
        this.setEditing(undefined);
    }

    public canceladd_click(): void {
        const index = this.value!.indexOf(this.inEditing!);
        this.value!.splice(index, 1);

        this.changeStatus(LiStatus.normal);
        this.setSelected(this.beforeSelected);
        this.setEditing(undefined);
    }

    private changeStatus(status: LiStatus): void {
        this.status = status;
    }

    private collectionStatusValidator(control: AbstractControl): ValidationErrors | null {
        if (this.status == LiStatus.normal) {
            return null;
        }
        else {
            return { collectionStatus: this.status }
        }
    }

    public getSelectedStyle(item: ICollectionItem<V>): string {
        return item === this.inSelected ?
            this.inMeta.selectStyle || 'active' :
            '';
    }
}
