/**
 * Enum que define os possíveis status de validação
 */
export enum ValidationStatus {
    /** Estado inicial, ainda não foi validado */
    Pristine = 'pristine',
    /** Validação passou com sucesso */
    Valid = 'valid',
    /** Validação falhou */
    Invalid = 'invalid'
}
