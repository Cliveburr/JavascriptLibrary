import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IInput } from '../../model';
import { BaseComponent } from '../base-component';
import { ValidatorsControl } from '../validators/validators.control';

@Component({
    template: ''
})
export abstract class BaseInputComponent<V, M extends IInput> extends BaseComponent<V, M> {

    public inValidator: ValidatorsControl;

    protected setControlForm(): void {
        this.inValidator = new ValidatorsControl(this.inMeta.validators, this.value, this.inMeta.disabled || false);
        
        if (this.inMeta.formGroup && this.inMeta.id) {
            const formControl = <FormGroup>this.inMeta.formGroup;
            if (formControl.contains(this.inMeta.id)) {
                formControl.removeControl(this.inMeta.id);
            }
            formControl.addControl(this.inMeta.id, this.inValidator.formControl);
        }
    }

}