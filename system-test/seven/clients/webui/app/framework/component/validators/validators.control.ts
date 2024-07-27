import { AsyncValidatorFn, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { IValidators, IValidatorsFunc } from '../../model';
import * as customValidators from './custom-validadors';

export type IValidatorsInput = IValidators | undefined | (IValidators | undefined)[];

export class ValidatorsControl {
    
    public validators: IValidatorsFunc[];
    public formControl: FormControl;

    public constructor(
        data: IValidatorsInput | undefined,
        value: any,
        disabled: boolean
    ) {
        this.buildValidators(data);
        this.buildFormControl(value, disabled);
    }

    private buildValidators(data: IValidatorsInput | undefined): void {
        if (!data) {
            this.validators = [];
        }

        const validators = Array.isArray(data) ?
            data :
            [data];

        this.validators = <any>validators
            .filter(this.filterNotUndefined)
            .map(v => typeof v === 'string' ?
                this.validatorFromString(v) :
                this.checkForKnowValidator(v));
    }

    private filterNotUndefined<T>(el: T | undefined | null): el is T {
        return el !== null && el !== undefined;
    }

    private validatorFromString(validator: string): IValidatorsFunc {
        switch (validator) {
            case 'required':
                return {
                    key: 'required',
                    message: 'Esse item é requerido!',
                    validator: Validators.required
                }
            case 'requiredAny':
                return {
                    key: 'requiredAny',
                    message: 'Essa lista é requerida!',
                    validator: customValidators.requiredAny
                }
            case 'collectionRequiredAny':
                return {
                    key: 'collectionRequiredAny',
                    message: 'Essa lista é requerida!',
                    validator: customValidators.collectionRequiredAny
                }
            case 'email':
                return {
                    key: 'email',
                    message: 'Email inválido!',
                    validator: Validators.email
                }
            default:
                throw 'Invalid validator: ' + validator;
        }
    }

    private checkForKnowValidator(validator: IValidatorsFunc): IValidatorsFunc {
        if (!validator.validator && !validator.asyncValidator) {
            switch (validator.key) {
                case 'required':
                    validator.validator = Validators.required;
                    break;
                case 'requiredAny':
                    validator.validator = customValidators.requiredAny;
                    break;
                case 'collectionRequiredAny':
                    validator.validator = customValidators.collectionRequiredAny;
                    break;
                case 'email':
                    validator.validator = Validators.email;
                    break;
                default:
                    throw 'Invalid validator: ' + validator;
            }
        }
        return validator;
    }

    private buildFormControl(value: any, disabled: boolean): void {
        const validators = this.validators
            .filter(v => v.validator)
            .map(v => <ValidatorFn>v.validator);

        const asyncValidators = this.validators
            .filter(v => v.asyncValidator)
            .map(v => <AsyncValidatorFn>v.asyncValidator);

        this.formControl = new FormControl({
            value,
            disabled,
        }, validators, asyncValidators);
    }

    public getErrosMessage(): string[] {
        const errors: string[] = [];
        if (this.formControl.errors) {
            for (let prop in this.formControl.errors) {
                const inValidators = this.validators
                    .find(v => v.key == prop);
                if (inValidators && inValidators.message) {
                    errors.push(inValidators.message);
                }
                else {
                    errors.push(this.formControl.errors[prop]);
                }
            }
        }
        return errors;
    }

    public get hasValidators(): boolean {
        return this.validators.length > 0;
    }

    public get isInvalidAndUntouched(): boolean {
        return this.hasValidators && this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
    }

    public get isValidAndUntouched(): boolean {
        return this.hasValidators && !this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
    }
}