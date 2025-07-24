import { IValidator } from './IValidator';
import { ValidationStatus } from './ValidationStatus';

/**
 * Coleção de validadores comuns
 */
export class CommonValidators {
    /**
     * Validador que verifica se o valor é obrigatório (não nulo, undefined ou string vazia)
     */
    static required(message: string = 'Este campo é obrigatório'): IValidator {
        return {
            name: 'required',
            message,
            validator: (value: any) => {
                if (value === null || value === undefined || 
                    (typeof value === 'string' && value.trim() === '')) {
                    return ValidationStatus.Invalid;
                }
                return ValidationStatus.Valid;
            }
        };
    }

    /**
     * Validador que verifica o comprimento mínimo de uma string
     */
    static minLength(min: number, message?: string): IValidator {
        return {
            name: 'minLength',
            message: message || `Deve ter pelo menos ${min} caracteres`,
            validator: (value: any) => {
                if (typeof value !== 'string') {
                    return ValidationStatus.Invalid;
                }
                return value.length >= min ? ValidationStatus.Valid : ValidationStatus.Invalid;
            }
        };
    }

    /**
     * Validador que verifica o comprimento máximo de uma string
     */
    static maxLength(max: number, message?: string): IValidator {
        return {
            name: 'maxLength',
            message: message || `Deve ter no máximo ${max} caracteres`,
            validator: (value: any) => {
                if (typeof value !== 'string') {
                    return ValidationStatus.Invalid;
                }
                return value.length <= max ? ValidationStatus.Valid : ValidationStatus.Invalid;
            }
        };
    }

    /**
     * Validador que verifica se o valor é um email válido
     */
    static email(message: string = 'Email inválido'): IValidator {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            name: 'email',
            message,
            validator: (value: any) => {
                if (typeof value !== 'string') {
                    return ValidationStatus.Invalid;
                }
                return emailRegex.test(value) ? ValidationStatus.Valid : ValidationStatus.Invalid;
            }
        };
    }

    /**
     * Validador que verifica se o valor é um número
     */
    static numeric(message: string = 'Deve ser um número'): IValidator {
        return {
            name: 'numeric',
            message,
            validator: (value: any) => {
                const num = Number(value);
                return !isNaN(num) && isFinite(num) ? ValidationStatus.Valid : ValidationStatus.Invalid;
            }
        };
    }

    /**
     * Validador que verifica valor mínimo para números
     */
    static min(min: number, message?: string): IValidator {
        return {
            name: 'min',
            message: message || `Deve ser maior ou igual a ${min}`,
            validator: (value: any) => {
                const num = Number(value);
                if (isNaN(num)) {
                    return ValidationStatus.Invalid;
                }
                return num >= min ? ValidationStatus.Valid : ValidationStatus.Invalid;
            }
        };
    }

    /**
     * Validador que verifica valor máximo para números
     */
    static max(max: number, message?: string): IValidator {
        return {
            name: 'max',
            message: message || `Deve ser menor ou igual a ${max}`,
            validator: (value: any) => {
                const num = Number(value);
                if (isNaN(num)) {
                    return ValidationStatus.Invalid;
                }
                return num <= max ? ValidationStatus.Valid : ValidationStatus.Invalid;
            }
        };
    }

    /**
     * Validador que verifica se o valor corresponde a um padrão regex
     */
    static pattern(regex: RegExp, message: string = 'Formato inválido'): IValidator {
        return {
            name: 'pattern',
            message,
            validator: (value: any) => {
                if (typeof value !== 'string') {
                    return ValidationStatus.Invalid;
                }
                return regex.test(value) ? ValidationStatus.Valid : ValidationStatus.Invalid;
            }
        };
    }

    /**
     * Validador customizado que aceita uma função
     */
    static custom(
        validatorFn: (value: any) => boolean,
        name: string = 'custom',
        message: string = 'Validação falhou'
    ): IValidator {
        return {
            name,
            message,
            validator: (value: any) => {
                return validatorFn(value) ? ValidationStatus.Valid : ValidationStatus.Invalid;
            }
        };
    }

    /**
     * Validador assíncrono customizado
     */
    static customAsync(
        validatorFn: (value: any) => Promise<boolean>,
        name: string = 'customAsync',
        message: string = 'Validação assíncrona falhou'
    ): IValidator {
        return {
            name,
            message,
            asyncValidator: async (value: any) => {
                try {
                    const result = await validatorFn(value);
                    return result ? ValidationStatus.Valid : ValidationStatus.Invalid;
                } catch {
                    return ValidationStatus.Invalid;
                }
            }
        };
    }
}
