import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormGroup } from '@angular/forms';
import { GlobalId } from '../../helpers/global-id';
import { BaseComponent } from '../base-component';
import { IValidatorsInput, ValidatorsControl } from '../validators/validators.control';

@Component({
    template: ''
})
export abstract class BaseInputComponent<V> extends BaseComponent implements ControlValueAccessor {

    @Input() validators?: IValidatorsInput;
    @Input() disabled?: any;
    @Input() formGroup?: FormGroup;

    public onTouched: () => void;
    public onChange: (value: V) => void;

    public inValidator: ValidatorsControl;
    public inValue: V;
    protected disfirnull?: boolean;

    public id: string;

    public constructor() {
        super()
        this.id = GlobalId.generateNewId();
    }

    public registerOnChange(fn: (value: V) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    @Input()
    public get value(): V {
        return this.inValue;
    };

    public set value(value: V) {
        //console.log('value', value);
        if (value !== this.inValue) {
            this.inValue = value;
            this.onValueChanged();
            if (this.onChange) {
                this.onChange(value);
            }
        }
    }

    // @Input()
    // public set ngModel(value: V) {
    //     //console.log('ngModel', value);
    //     if (value !== this.inValue) {
    //         this.inValue = value;
    //         this.onValueChanged();
    //     }
    // }

    public writeValue(value: V) {
        //console.log('writeValue', value);
        if (this.disfirnull) {
            delete this.disfirnull;
            if (value === null || value === undefined) {
                return;
            }
        }
        if (value !== this.inValue) {
            this.inValue = value;
            this.onValueChanged();
        }
    }

    public onValueChanged(): void {
    }

    protected setControlForm(): void {
        this.inValidator = new ValidatorsControl(this.validators, this.value, this.getValueFromAnyBollean(this.disabled));
        
        if (this.formGroup && this.id) {
            const formControl = <FormGroup>this.formGroup;
            if (formControl.contains(this.id)) {
                formControl.removeControl(this.id);
            }
            formControl.addControl(this.id, this.inValidator.formControl);
        }
    }
}