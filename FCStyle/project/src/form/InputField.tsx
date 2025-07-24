import React, { useState } from 'react';
import { Input, InputProps } from './Input';
import { ValidatorControl } from '../validator/ValidatorControl';
import { ValidationStatus } from '../validator/ValidationStatus';

/**
 * Propriedades do componente InputField
 * 
 * Exemplo de uso:
 * ```tsx
 * import { InputField, ValidatorControl, CommonValidators } from 'fcstyle';
 * 
 * // Com ValidatorControl
 * const emailValidator = new ValidatorControl([
 *   CommonValidators.required('Email é obrigatório'),
 *   CommonValidators.email('Email inválido')
 * ]);
 * 
 * <InputField 
 *   label="Email"
 *   type="email"
 *   placeholder="Digite seu email"
 *   validatorControl={emailValidator}
 * />
 * 
 * // Com mensagem de erro customizada
 * <InputField 
 *   label="Nome"
 *   type="text"
 *   placeholder="Digite seu nome"
 *   errorMessage="Nome inválido"
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
export interface InputFieldProps extends InputProps {
  label?: string;
  errorMessage?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  errorMessage,
  ...inputProps
}) => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(ValidationStatus.Pristine);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const handleValidationChange = (status: ValidationStatus, message: string) => {
    setValidationStatus(status);
    setValidationMessage(message);
    
    // Chama o callback original se fornecido
    if (inputProps.onValidationChange) {
      inputProps.onValidationChange(status, message);
    }
  };

  const displayErrorMessage = errorMessage || validationMessage;

  return (
    <div className="input-container">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <Input
        {...inputProps}
        onValidationChange={handleValidationChange}
      />
      {displayErrorMessage && validationStatus === ValidationStatus.Invalid && (
        <div className="input-error-message">
          {displayErrorMessage}
        </div>
      )}
    </div>
  );
};
