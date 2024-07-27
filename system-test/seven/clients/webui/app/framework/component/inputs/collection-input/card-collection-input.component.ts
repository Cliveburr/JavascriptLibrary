import { Component, OnInit, Input, HostBinding, TemplateRef } from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { CollectionItemStatus, ICardCollectionInput, ICollectionItem } from '../../../model';
import { GlobalId } from '../../../helpers';
import { BaseCollectionInputComponent } from './base-collection-input';

enum CollectionStatus {
    normal = 0,
    editing = 1,
    adding = 2
}

interface CardCollectionViewItem<V> {
    item?: ICollectionItem<V>;
    selectStyle: string;
    viewStyle: 'normal' | 'inline' | 'modal';
}

@Component({
    selector: 's-card-collection-input',
    templateUrl: 'card-collection-input.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: CardCollectionInputComponent, multi: true }
    ]
})
export class CardCollectionInputComponent<V> extends BaseCollectionInputComponent<ICollectionItem<V>, ICardCollectionInput<V>> implements OnInit {

    @Input() public cardView: TemplateRef<any>;
    @Input() public editView: TemplateRef<any>;
    @HostBinding('class') public hostClass: string;
    
    public status: CollectionStatus;
    public viewItems: CardCollectionViewItem<V>[];
    private execPromise?: (value: V | undefined) => void;

    public constructor(
    ) {
        super()
    }

    public ngOnInit(): void {
        this.prepareMeta();
        this.customControlForm();
        this.prepareSelectedMode();
        this.makeViewItems();
    }

    private prepareMeta(): void {
        this.meta.id ||= GlobalId.generateNewId();
        this.hostClass = 'form-group ' + this.meta.class;
        this.meta.editMode ||= 'inline';
        this.changeStatus(CollectionStatus.normal);
    }

    private customControlForm(): void {
        const validators = this.meta.validators || [];
        validators.push({
            key: 'collectionStatus',
            message: 'Complete a edição!',
            validator: this.collectionStatusValidator.bind(this)
        });
        this.setControlForm(validators);
    }

    public add_click(): void {
        if (this.checkForNewAction() || this.checkForSelectGroup()) {
            return;
        }
        
        const value = this.meta.onAddItem ?
            this.meta.onAddItem() :
            <V>{};

        const newItem = {
            value,
            status: CollectionItemStatus.create
        }
        this.value!.push(newItem);
        this.changeStatus(CollectionStatus.adding);
        //this.inValidator.formControl.updateValueAndValidity();
        this.setSelected(undefined);
        this.setEditing(newItem);
        this.makeViewItems();
    }

    private checkForNewAction(): boolean {
        if (this.status != CollectionStatus.normal) {
            this.inValidator.formControl.markAllAsTouched();
            this.inValidator.formControl.updateValueAndValidity();
            return true;
        }
        return false;
    }

    private changeStatus(status: CollectionStatus): void {
        this.status = status;
    }

    private makeViewItems(): void {
        this.viewItems = (this.value || [])
            .filter(i => i.status != CollectionItemStatus.remove)
            .map(i => {
                return {
                    item: i,
                    selectStyle: i === this.inSelected ? this.inMeta.selectStyle || 'border-primary' : '',
                    viewStyle: i === this.inEditing ? this.meta.editMode! : 'normal'
                }
            });
    }

    public onValueChanged(): void {
        this.makeViewItems();
    }

    public select_click(item?: ICollectionItem<V>): void {
        this.applyOnView(this.inSelected, v => v.selectStyle = '');
        super.select_click(item);
        this.applyOnView(this.inSelected, v => v.selectStyle = this.inMeta.selectStyle || 'border-primary');
    }

    private applyOnView(item: ICollectionItem<V> | undefined, apply: (view: CardCollectionViewItem<V>) => void): void {
        const view = this.viewItems
            .find(i => i.item === item);
        if (view) {
            apply(view);
        }
    }

    public edit_click(item: ICollectionItem<V>): void {
        if (this.checkForNewAction() || this.checkForSelectGroup()) {
            return;
        }
        item.status = CollectionItemStatus.update;
        this.changeStatus(CollectionStatus.editing);
        //this.inValidator.formControl.updateValueAndValidity();
        this.setSelected(undefined);
        this.setEditing(item);
        this.makeViewItems();
    }

    public async showEdit(item: V): Promise<V | undefined> {
        return new Promise((e, r) => {
            const value = this.viewItems
                .find(i => i.item!.value === item)
            if (!value || this.checkForNewAction() || this.checkForSelectGroup()) {
                e(undefined);
            }
            else {
                this.execPromise = e;
                this.edit_click(value.item!);
            }
        });
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
        this.makeViewItems();
    }

    public conclude_click(): void {
        if (this.inMeta.editGroup) {
            this.inMeta.editGroup.markAllAsTouched();
            if (this.inMeta.editGroup.invalid) {
                return;
            }
        }
        if (this.status == CollectionStatus.editing) {
            this.inEditing!.status = CollectionItemStatus.update;
            this.inMeta.onEditItem!(this.inEditing!.value!);
        }
        if (this.status == CollectionStatus.adding && this.meta.doneAddItem) {
            this.meta.doneAddItem(this.inEditing!.value!);
        }
        this.changeStatus(CollectionStatus.normal);
        this.inValidator.formControl.updateValueAndValidity();
        this.setSelected(this.inEditing);
        const editing = this.inEditing;
        this.setEditing(undefined);
        if (this.execPromise) {
            this.execPromise(editing!.value);
            this.applyOnView(editing, v => v.viewStyle = 'normal');
        }
        else {
            this.makeViewItems();
        }
    }

    public canceladd_click(): void {
        if (this.status == CollectionStatus.adding) {
            const index = this.value!.indexOf(this.inEditing!);
            this.value!.splice(index, 1);
        }
        this.changeStatus(CollectionStatus.normal);
        this.setSelected(this.beforeSelected);
        const editing = this.inEditing;
        this.setEditing(undefined);
        if (this.execPromise) {
            this.execPromise(undefined);
            this.applyOnView(editing, v => v.viewStyle = 'normal');
        }
        else {
            this.makeViewItems();
        }
    }

    private collectionStatusValidator(control: AbstractControl): ValidationErrors | null {
        if (this.status == CollectionStatus.normal) {
            return null;
        }
        else {
            return { collectionStatus: this.status }
        }
    }

    public refresh(): void {
        this.makeViewItems();
    }
}