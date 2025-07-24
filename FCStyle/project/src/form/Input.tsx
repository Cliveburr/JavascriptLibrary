import React, { useState, useEffect } from 'react';
import { ValidatorControl } from '../validator/ValidatorControl';
import { ValidationStatus } from '../validator/ValidationStatus';

/**
 * Propriedades do componente Input básico
 * 
 * Exemplo de uso:
 * ```tsx
 * import { Input, ValidatorControl, CommonValidators } from 'fcstyle';
 * 
 * // Com ValidatorControl
 * const emailValidator = new ValidatorControl([
 *   CommonValidators.required('Email é obrigatório'),
 *   CommonValidators.email('Email inválido')
 * ]);
 * 
 * <Input 
 *   type="email"
 *   placeholder="Digite seu email"
 *   validatorControl={emailValidator}
 *   onValidationChange={(status, message) => console.log(status, message)}
 * />
 * ```
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  validatorControl?: ValidatorControl;
  className?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (status: ValidationStatus, message: string) => void;
}

export const Input: React.FC<InputProps> = ({
  validatorControl,
  className = '',
  onChange,
  onValidationChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>(props.value?.toString() || '');
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(ValidationStatus.Pristine);
  const [validationMessage, setValidationMessage] = useState<string>('');

  // Atualiza o valor inicial se props.value mudar
  useEffect(() => {
    if (props.value !== undefined) {
      setInputValue(props.value.toString());
    }
  }, [props.value]);

  // Monitora mudanças no ValidatorControl
  useEffect(() => {
    if (validatorControl) {
      const currentResult = validatorControl.validate();
      setValidationStatus(currentResult.status);
      setValidationMessage(currentResult.messages[0] || '');
      
      // Notifica mudança de validação para o componente pai
      if (onValidationChange) {
        onValidationChange(currentResult.status, currentResult.messages[0] || '');
      }
    }
  }, [validatorControl, inputValue, onValidationChange]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Atualiza o ValidatorControl se fornecido
    if (validatorControl) {
      validatorControl.setValue(newValue);
      const result = validatorControl.validate();
      setValidationStatus(result.status);
      setValidationMessage(result.messages[0] || '');
      
      // Notifica mudança de validação para o componente pai
      if (onValidationChange) {
        onValidationChange(result.status, result.messages[0] || '');
      }
    }

    // Chama o onChange personalizado
    if (onChange) {
      onChange(newValue);
    }
  };

  const getInputClassNames = () => {
    const baseClasses = ['input'];
    
    if (validationStatus === ValidationStatus.Valid) {
      baseClasses.push('valid');
    } else if (validationStatus === ValidationStatus.Invalid) {
      baseClasses.push('invalid');
    }
    
    if (className) {
      baseClasses.push(className);
    }
    
    return baseClasses.join(' ');
  };

  return (
    <input
      {...props}
      value={inputValue}
      onChange={handleInputChange}
      className={getInputClassNames()}
    />
  );
};
