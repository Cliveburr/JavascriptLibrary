import { Component, Input, OnDestroy } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { Subscription } from "rxjs";
import { ExtendedFormControl } from ".";
import { BaseComponent } from "./base.component";
import { ValidatorsControl, IValidatorsInput } from "./inputs/validators/validators.control";

@Component({
    template: ''
})
export abstract class ValueBaseComponent<T> extends BaseComponent implements ControlValueAccessor, OnDestroy {
    
    @Input() validators?: IValidatorsInput;

    public validator!: ValidatorsControl;

    private onChangesSub?: Subscription;
    private onTouchedSub?: Subscription;

    public constructor() {
        super()
    }

    public initValidator(value: any, disabled?: boolean, validators?: IValidatorsInput): void {
        this.validator = new ValidatorsControl(value, disabled, validators);
    }

    public registerOnChange(fn: (value: any) => {}): void {
        this.onChangesSub = this.control.valueChanges.subscribe(fn);
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouchedSub = this.control.touchedChanges.subscribe(fn);
    }

    @Input()
    public get value(): T | undefined {
        return this.control.value;
    };

    public set value(value: T | undefined) {
        this.control.setValue(value);
    }

    public writeValue(value: T | undefined) {
        //console.log('write value', value)
        this.control.setValue(value);
    }

    public ngOnDestroy(): void {
        this.onChangesSub?.unsubscribe();
        this.onTouchedSub?.unsubscribe();
    }

    public get control(): ExtendedFormControl {
        return this.validator.control;
    }
}