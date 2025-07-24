import { ValidatorControl, ValidationResult } from './ValidatorControl';
import { ValidationStatus } from './ValidationStatus';
import { CommonValidators } from './CommonValidators';

/**
 * Tipos utilitários para formulários
 */

/**
 * Tipo que representa o estado de um campo de formulário
 */
export interface FormFieldState<T = any> {
    value: T;
    control: ValidatorControl;
    result?: ValidationResult;
    touched: boolean;
    dirty: boolean;
}

/**
 * Tipo que representa um formulário completo
 */
export type FormState<T extends Record<string, any> = Record<string, any>> = {
    [K in keyof T]: FormFieldState<T[K]>;
};

/**
 * Configuração para criar um campo de formulário
 */
export interface FormFieldConfig<T = any> {
    initialValue?: T;
    validators?: Array<import('./IValidator').IValidator>;
    required?: boolean;
}

/**
 * Configuração para criar um formulário
 */
export type FormConfig<T extends Record<string, any> = Record<string, any>> = {
    [K in keyof T]: FormFieldConfig<T[K]>;
};

/**
 * Resultado da validação de um formulário completo
 */
export interface FormValidationResult {
    isValid: boolean;
    errors: Record<string, string[]>;
    touchedFields: string[];
    dirtyFields: string[];
    formResult: ValidationResult;
}

/**
 * Classe utilitária para gerenciar formulários
 */
export class FormManager<T extends Record<string, any> = Record<string, any>> {
    private formControl: ValidatorControl;
    private fieldStates: FormState<T>;

    constructor(config: FormConfig<T>) {
        this.formControl = new ValidatorControl();
        this.fieldStates = {} as FormState<T>;

        this.initializeFields(config);
    }

    private initializeFields(config: FormConfig<T>): void {
        for (const [fieldName, fieldConfig] of Object.entries(config) as Array<[keyof T, FormFieldConfig]>) {
            const validators = fieldConfig.validators || [];
            
            // Adiciona validador required se especificado
            if (fieldConfig.required) {
                validators.unshift(CommonValidators.required(`${String(fieldName)} é obrigatório`));
            }

            const control = new ValidatorControl(validators, fieldConfig.initialValue);
            this.formControl.addControl(String(fieldName), control);

            this.fieldStates[fieldName] = {
                value: fieldConfig.initialValue,
                control,
                touched: false,
                dirty: false
            } as FormFieldState<T[keyof T]>;
        }
    }

    /**
     * Define o valor de um campo
     */
    setValue<K extends keyof T>(fieldName: K, value: T[K]): void {
        const fieldState = this.fieldStates[fieldName];
        if (fieldState) {
            const oldValue = fieldState.value;
            fieldState.value = value;
            fieldState.control.setValue(value);
            fieldState.dirty = fieldState.dirty || (oldValue !== value);
        }
    }

    /**
     * Obtém o valor de um campo
     */
    getValue<K extends keyof T>(fieldName: K): T[K] | undefined {
        return this.fieldStates[fieldName]?.value;
    }

    /**
     * Marca um campo como tocado
     */
    markAsTouched<K extends keyof T>(fieldName: K): void {
        const fieldState = this.fieldStates[fieldName];
        if (fieldState) {
            fieldState.touched = true;
        }
    }

    /**
     * Marca todos os campos como tocados
     */
    markAllAsTouched(): void {
        for (const fieldName of Object.keys(this.fieldStates) as Array<keyof T>) {
            this.markAsTouched(fieldName);
        }
    }

    /**
     * Valida um campo específico
     */
    validateField<K extends keyof T>(fieldName: K): ValidationResult | undefined {
        const fieldState = this.fieldStates[fieldName];
        if (fieldState) {
            const result = fieldState.control.validate();
            fieldState.result = result;
            return result;
        }
        return undefined;
    }

    /**
     * Valida todo o formulário
     */
    validate(): FormValidationResult {
        const formResult = this.formControl.validateAll();
        
        // Atualiza resultados individuais dos campos
        for (const [fieldName, fieldState] of Object.entries(this.fieldStates) as Array<[keyof T, FormFieldState]>) {
            fieldState.result = fieldState.control.validate();
        }

        const errors: Record<string, string[]> = {};
        const touchedFields: string[] = [];
        const dirtyFields: string[] = [];

        for (const [fieldName, fieldState] of Object.entries(this.fieldStates) as Array<[string, FormFieldState]>) {
            if (fieldState.result && fieldState.result.messages.length > 0) {
                errors[fieldName] = fieldState.result.messages;
            }
            if (fieldState.touched) {
                touchedFields.push(fieldName);
            }
            if (fieldState.dirty) {
                dirtyFields.push(fieldName);
            }
        }

        return {
            isValid: formResult.status === ValidationStatus.Valid,
            errors,
            touchedFields,
            dirtyFields,
            formResult
        };
    }

    /**
     * Valida todo o formulário (assíncrono)
     */
    async validateAsync(): Promise<FormValidationResult> {
        const formResult = await this.formControl.validateAllAsync();
        
        // Atualiza resultados individuais dos campos
        for (const [fieldName, fieldState] of Object.entries(this.fieldStates) as Array<[keyof T, FormFieldState]>) {
            fieldState.result = await fieldState.control.validateAsync();
        }

        const errors: Record<string, string[]> = {};
        const touchedFields: string[] = [];
        const dirtyFields: string[] = [];

        for (const [fieldName, fieldState] of Object.entries(this.fieldStates) as Array<[string, FormFieldState]>) {
            if (fieldState.result && fieldState.result.messages.length > 0) {
                errors[fieldName] = fieldState.result.messages;
            }
            if (fieldState.touched) {
                touchedFields.push(fieldName);
            }
            if (fieldState.dirty) {
                dirtyFields.push(fieldName);
            }
        }

        return {
            isValid: formResult.status === ValidationStatus.Valid,
            errors,
            touchedFields,
            dirtyFields,
            formResult
        };
    }

    /**
     * Obtém o estado de um campo
     */
    getFieldState<K extends keyof T>(fieldName: K): FormFieldState<T[K]> | undefined {
        return this.fieldStates[fieldName];
    }

    /**
     * Obtém todos os valores do formulário
     */
    getValues(): Partial<T> {
        const values: Partial<T> = {};
        for (const [fieldName, fieldState] of Object.entries(this.fieldStates) as Array<[keyof T, FormFieldState]>) {
            values[fieldName] = fieldState.value;
        }
        return values;
    }

    /**
     * Define todos os valores do formulário
     */
    setValues(values: Partial<T>): void {
        for (const [fieldName, value] of Object.entries(values) as Array<[keyof T, any]>) {
            if (fieldName in this.fieldStates) {
                this.setValue(fieldName, value);
            }
        }
    }

    /**
     * Reseta o formulário para o estado inicial
     */
    reset(): void {
        for (const fieldState of Object.values(this.fieldStates) as FormFieldState[]) {
            fieldState.control.reset();
            fieldState.touched = false;
            fieldState.dirty = false;
            fieldState.result = undefined;
        }
    }

    /**
     * Verifica se o formulário foi modificado
     */
    isDirty(): boolean {
        return Object.values(this.fieldStates).some(state => state.dirty);
    }

    /**
     * Verifica se algum campo foi tocado
     */
    isTouched(): boolean {
        return Object.values(this.fieldStates).some(state => state.touched);
    }

    /**
     * Obtém o controle principal do formulário
     */
    getFormControl(): ValidatorControl {
        return this.formControl;
    }
}
