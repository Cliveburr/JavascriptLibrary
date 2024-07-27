import { AsyncValidatorFn, ValidatorFn, Validators } from '@angular/forms';
import * as customValidators from './custom-validators';
import { ExtendedFormControl } from './extend-formcontrol';

export type IValidatorString = 'required' | 'requiredAny' | 'email';
export type IValidators = IValidatorString | IValidatorsFunc;

export interface IValidatorsFunc {
    validator?: ValidatorFn;
    asyncValidator?: AsyncValidatorFn;
    key: string;
    message?: string;
}

export type IValidatorsInput = IValidators | IValidators[];

export class ValidatorsControl {
    
    public validators: IValidatorsFunc[];
    public control: ExtendedFormControl;

    public constructor(
        value: any,
        disabled?: boolean,
        validators?: IValidatorsInput
    ) {
        this.validators = [];
        this.control = new ExtendedFormControl({ value, disabled });
        if (validators) {
            this.addValidators(validators);
        }
    }

    public addValidators(data: IValidatorsInput): void {
        const validatorsInput = Array.isArray(data) ?
            data :
            [data];

        const validators = validatorsInput
            .map(v => typeof v === 'string' ?
                this.validatorFromString(v) :
                this.checkForKnowValidator(v));

        for (const validator of validators) {
            this.validators.push(validator);

            if (validator.validator) {
                this.control.addValidators(validator.validator)
            }

            if (validator.asyncValidator) {
                this.control.addAsyncValidators(validator.asyncValidator)
            }
        }
    }

    private validatorFromString(validator: IValidatorString): IValidatorsFunc {
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
            // case 'collectionRequiredAny':
            //     return {
            //         key: 'collectionRequiredAny',
            //         message: 'Essa lista é requerida!',
            //         validator: customValidators.collectionRequiredAny
            //     }
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
                // case 'collectionRequiredAny':
                //     validator.validator = customValidators.collectionRequiredAny;
                //     break;
                case 'email':
                    validator.validator = Validators.email;
                    break;
                default:
                    throw 'Invalid validator: ' + validator;
            }
        }
        return validator;
    }

    // private buildcontrol(value: any, disabled: boolean): void {
    //     const validators = this.validators
    //         .filter(v => v.validator)
    //         .map(v => <ValidatorFn>v.validator);

    //     const asyncValidators = this.validators
    //         .filter(v => v.asyncValidator)
    //         .map(v => <AsyncValidatorFn>v.asyncValidator);

    //     this.control = new control({
    //         value,
    //         disabled,
    //     }, validators, asyncValidators);
    // }

    public getErrosMessage(): string[] {
        const errors: string[] = [];
        if (this.control.errors) {
            for (let prop in this.control.errors) {
                const inValidators = this.validators
                    .find(v => v.key == prop);
                if (inValidators && inValidators.message) {
                    errors.push(inValidators.message);
                }
                else {
                    errors.push(this.control.errors[prop]);
                }
            }
        }
        return errors;
    }

    public get hasValidators(): boolean {
        return this.validators.length > 0;
    }

    public get isInvalidAndUntouched(): boolean {
        return this.hasValidators && this.control.invalid && (this.control.dirty || this.control.touched);
    }

    public get isValidAndUntouched(): boolean {
        return this.hasValidators && !this.control.invalid && (this.control.dirty || this.control.touched);
    }
}