import { ValidationStatus } from './ValidationStatus';

/**
 * Interface que define um validador
 */
export interface IValidator {
    /** Função de validação síncrona */
    validator?: (value: any) => ValidationStatus;
    /** Função de validação assíncrona */
    asyncValidator?: (value: any) => Promise<ValidationStatus>;
    /** Mensagem de erro a ser exibida quando a validação falha */
    message?: string;
    /** Nome do validador para identificação */
    name?: string;
}
