import { IValidator } from './IValidator';
import { ValidationStatus } from './ValidationStatus';

/**
 * Resultado da validação contendo status e mensagens de erro
 */
export interface ValidationResult {
    status: ValidationStatus;
    messages: string[];
    errors: { [validatorName: string]: string };
}

/**
 * Classe que agrupa um conjunto de IValidator para validar quando necessário,
 * incluindo suporte para parents, children e outros ValidatorControl
 */
export class ValidatorControl {
    private validators: IValidator[] = [];
    private value: any = null;
    private currentStatus: ValidationStatus = ValidationStatus.Pristine;
    private parent: ValidatorControl | null = null;
    private children: ValidatorControl[] = [];
    private childControls: { [key: string]: ValidatorControl } = {};

    constructor(validators: IValidator[] = [], initialValue?: any) {
        this.validators = validators;
        if (initialValue !== undefined) {
            this.value = initialValue;
        }
    }

    /**
     * Define o valor a ser validado
     */
    setValue(value: any): void {
        this.value = value;
        this.currentStatus = ValidationStatus.Pristine;
    }

    /**
     * Obtém o valor atual
     */
    getValue(): any {
        return this.value;
    }

    /**
     * Adiciona um validador ao controle
     */
    addValidator(validator: IValidator): void {
        this.validators.push(validator);
    }

    /**
     * Remove um validador pelo nome
     */
    removeValidator(name: string): void {
        this.validators = this.validators.filter(v => v.name !== name);
    }

    /**
     * Valida o valor atual usando todos os validadores síncronos
     */
    validate(): ValidationResult {
        if (this.validators.length === 0) {
            this.currentStatus = ValidationStatus.Valid;
            return {
                status: ValidationStatus.Valid,
                messages: [],
                errors: {}
            };
        }

        const messages: string[] = [];
        const errors: { [validatorName: string]: string } = {};
        let hasInvalid = false;

        for (const validator of this.validators) {
            if (validator.validator) {
                const result = validator.validator(this.value);
                if (result === ValidationStatus.Invalid) {
                    hasInvalid = true;
                    const message = validator.message || 'Validation failed';
                    const name = validator.name || 'unknown';
                    messages.push(message);
                    errors[name] = message;
                }
            }
        }

        this.currentStatus = hasInvalid ? ValidationStatus.Invalid : ValidationStatus.Valid;

        return {
            status: this.currentStatus,
            messages,
            errors
        };
    }

    /**
     * Valida o valor atual usando todos os validadores (síncronos e assíncronos)
     */
    async validateAsync(): Promise<ValidationResult> {
        if (this.validators.length === 0) {
            this.currentStatus = ValidationStatus.Valid;
            return {
                status: ValidationStatus.Valid,
                messages: [],
                errors: {}
            };
        }

        const messages: string[] = [];
        const errors: { [validatorName: string]: string } = {};
        let hasInvalid = false;

        // Primeiro executa validadores síncronos
        for (const validator of this.validators) {
            if (validator.validator) {
                const result = validator.validator(this.value);
                if (result === ValidationStatus.Invalid) {
                    hasInvalid = true;
                    const message = validator.message || 'Validation failed';
                    const name = validator.name || 'unknown';
                    messages.push(message);
                    errors[name] = message;
                }
            }
        }

        // Depois executa validadores assíncronos
        for (const validator of this.validators) {
            if (validator.asyncValidator) {
                try {
                    const result = await validator.asyncValidator(this.value);
                    if (result === ValidationStatus.Invalid) {
                        hasInvalid = true;
                        const message = validator.message || 'Async validation failed';
                        const name = validator.name || 'unknown-async';
                        messages.push(message);
                        errors[name] = message;
                    }
                } catch (error) {
                    hasInvalid = true;
                    const message = validator.message || 'Async validation error';
                    const name = validator.name || 'unknown-async';
                    messages.push(message);
                    errors[name] = message;
                }
            }
        }

        this.currentStatus = hasInvalid ? ValidationStatus.Invalid : ValidationStatus.Valid;

        return {
            status: this.currentStatus,
            messages,
            errors
        };
    }

    /**
     * Obtém o status atual da validação
     */
    getStatus(): ValidationStatus {
        return this.currentStatus;
    }

    /**
     * Verifica se o controle é válido
     */
    isValid(): boolean {
        return this.currentStatus === ValidationStatus.Valid;
    }

    /**
     * Verifica se o controle é inválido
     */
    isInvalid(): boolean {
        return this.currentStatus === ValidationStatus.Invalid;
    }

    /**
     * Verifica se o controle está em estado pristine
     */
    isPristine(): boolean {
        return this.currentStatus === ValidationStatus.Pristine;
    }

    /**
     * Define um controle pai
     */
    setParent(parent: ValidatorControl): void {
        this.parent = parent;
        parent.addChild(this);
    }

    /**
     * Obtém o controle pai
     */
    getParent(): ValidatorControl | null {
        return this.parent;
    }

    /**
     * Adiciona um controle filho
     */
    addChild(child: ValidatorControl): void {
        if (!this.children.includes(child)) {
            this.children.push(child);
            child.parent = this;
        }
    }

    /**
     * Remove um controle filho
     */
    removeChild(child: ValidatorControl): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.parent = null;
        }
    }

    /**
     * Obtém todos os controles filhos
     */
    getChildren(): ValidatorControl[] {
        return [...this.children];
    }

    /**
     * Adiciona um controle nomeado
     */
    addControl(name: string, control: ValidatorControl): void {
        this.childControls[name] = control;
        control.setParent(this);
    }

    /**
     * Obtém um controle pelo nome
     */
    getControl(name: string): ValidatorControl | undefined {
        return this.childControls[name];
    }

    /**
     * Remove um controle pelo nome
     */
    removeControl(name: string): void {
        const control = this.childControls[name];
        if (control) {
            control.parent = null;
            this.removeChild(control);
            delete this.childControls[name];
        }
    }

    /**
     * Valida todos os controles filhos
     */
    validateAll(): ValidationResult {
        const result = this.validate();
        const childResults: ValidationResult[] = [];

        // Valida controles filhos diretos
        for (const child of this.children) {
            childResults.push(child.validateAll());
        }

        // Valida controles nomeados
        for (const control of Object.values(this.childControls)) {
            childResults.push(control.validateAll());
        }

        // Combina resultados
        const allMessages = [
            ...result.messages,
            ...childResults.flatMap(r => r.messages)
        ];

        const allErrors = {
            ...result.errors,
            ...childResults.reduce((acc, r) => ({ ...acc, ...r.errors }), {})
        };

        const hasInvalid = result.status === ValidationStatus.Invalid || 
                          childResults.some(r => r.status === ValidationStatus.Invalid);

        return {
            status: hasInvalid ? ValidationStatus.Invalid : ValidationStatus.Valid,
            messages: allMessages,
            errors: allErrors
        };
    }

    /**
     * Valida todos os controles filhos (assíncrono)
     */
    async validateAllAsync(): Promise<ValidationResult> {
        const result = await this.validateAsync();
        const childResults: ValidationResult[] = [];

        // Valida controles filhos diretos
        for (const child of this.children) {
            childResults.push(await child.validateAllAsync());
        }

        // Valida controles nomeados
        for (const control of Object.values(this.childControls)) {
            childResults.push(await control.validateAllAsync());
        }

        // Combina resultados
        const allMessages = [
            ...result.messages,
            ...childResults.flatMap(r => r.messages)
        ];

        const allErrors = {
            ...result.errors,
            ...childResults.reduce((acc, r) => ({ ...acc, ...r.errors }), {})
        };

        const hasInvalid = result.status === ValidationStatus.Invalid || 
                          childResults.some(r => r.status === ValidationStatus.Invalid);

        return {
            status: hasInvalid ? ValidationStatus.Invalid : ValidationStatus.Valid,
            messages: allMessages,
            errors: allErrors
        };
    }

    /**
     * Sinaliza validação para o controle pai
     */
    notifyParent(): void {
        if (this.parent) {
            this.parent.validate();
            this.parent.notifyParent();
        }
    }

    /**
     * Reseta o status de validação para pristine
     */
    reset(): void {
        this.currentStatus = ValidationStatus.Pristine;
        this.children.forEach(child => child.reset());
        Object.values(this.childControls).forEach(control => control.reset());
    }
}
