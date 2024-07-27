import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { baseComponentForValue, ICollectionInput, ICollectionItem, IValidators } from '../../../model';
import { BaseComponent } from '../../base-component';
import { ValidatorsControl } from '../../validators/validators.control';

@Component({
    template: ''
})
export abstract class BaseCollectionInputComponent<V, M extends ICollectionInput> extends BaseComponent<V[] | undefined, M> {

    @Output() public selected: EventEmitter<V>;

    public inValidator: ValidatorsControl;
    protected formGroup: FormGroup;
    public inSelected?: V;
    public beforeSelected?: V;
    public inEditing?: V;

    public constructor() {
        super()
        this.selected = new EventEmitter<V>();
    }

    protected setControlForm(validators?: IValidators[]): void {
        this.inValidator = new ValidatorsControl(validators, this.value, false);
        this.formGroup = new FormGroup({
            __collection: this.inValidator.formControl
        });
        
        if (this.inMeta.formGroup && this.inMeta.id) {
            const formControl = <FormGroup>this.inMeta.formGroup;
            if (formControl.contains(this.inMeta.id)) {
                formControl.removeControl(this.inMeta.id);
            }
            formControl.addControl(this.inMeta.id, this.formGroup);
        }
    }

    protected prepareSelectedMode(): void {
        if (this.inMeta.selectMode) {
            if (this.value && this.value.length > 0) {
                this.setSelected(this.value[0]);
            }
        }
    }

    protected checkForSelectGroup(): boolean {
        if (this.inSelected && this.inMeta.selectGroup) {
            this.inMeta.selectGroup.markAllAsTouched();
            return this.inMeta.selectGroup.invalid;
        }
        else {
            return false;
        }
    }

    protected checkForEditGroup(): boolean {
        if (this.inSelected && this.inMeta.editGroup) {
            this.inMeta.editGroup.markAllAsTouched();
            return this.inMeta.editGroup.invalid;
        }
        else {
            return false;
        }
    }

    public select_click(item?: V): void {
        if (!this.inMeta.selectMode || this.checkForSelectGroup()) {
            return;
        }
        this.setSelected(item);
    }

    protected setSelected(item?: V): void {
        if (!this.inMeta.selectMode) {
            return;
        }
        if (this.inSelected === item) {
            item = undefined;
        }
        this.beforeSelected = this.inSelected;
        if (this.inSelected && this.inMeta.selectGroup) {
            this.inMeta.selectGroup.reset();
            this.formGroup.removeControl('selectedItem');
        }
        this.inSelected = item;
        this.selected.emit(item);
        if (this.inSelected && this.inMeta.selectGroup) {
            this.formGroup.addControl('selectedItem', this.inMeta.selectGroup);
        }
    }

    protected setEditing(item?: V): void {
        if (this.inEditing && this.inMeta.editGroup) {
            this.inMeta.editGroup.reset();
            this.formGroup.removeControl('editingItem');
        }
        this.inEditing = item;
        if (this.inEditing && this.inMeta.editGroup) {
            this.formGroup.addControl('editingItem', this.inMeta.editGroup);
        }
    }
}
