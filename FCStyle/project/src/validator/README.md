# FCStyle Validators

Sistema de validação flexível e tipado para o FCStyle framework.

## Características

- ✅ Validação síncrona e assíncrona
- ✅ Hierarquia de controles (pai/filho)
- ✅ Validadores pré-definidos comuns
- ✅ Validadores customizados
- ✅ Status de validação tipado
- ✅ Mensagens de erro customizáveis
- ✅ Suporte a TypeScript

## Status de Validação

```typescript
enum ValidationStatus {
    Pristine = 'pristine',  // Estado inicial, não validado
    Valid = 'valid',        // Validação passou
    Invalid = 'invalid'     // Validação falhou
}
```

## Uso Básico

### Validação Simples

```typescript
import { ValidatorControl, CommonValidators } from 'fcstyle';

const emailControl = new ValidatorControl([
    CommonValidators.required('Email é obrigatório'),
    CommonValidators.email('Formato de email inválido')
]);

emailControl.setValue('usuario@exemplo.com');
const result = emailControl.validate();

if (result.status === ValidationStatus.Valid) {
    console.log('Email válido!');
} else {
    console.log('Erros:', result.messages);
}
```

### Validação de Formulário

```typescript
const formControl = new ValidatorControl();

// Adicionando controles nomeados
formControl.addControl('name', new ValidatorControl([
    CommonValidators.required('Nome é obrigatório'),
    CommonValidators.minLength(2, 'Nome muito curto')
]));

formControl.addControl('email', new ValidatorControl([
    CommonValidators.required('Email é obrigatório'),
    CommonValidators.email('Email inválido')
]));

// Definindo valores
formControl.getControl('name')?.setValue('João');
formControl.getControl('email')?.setValue('joao@exemplo.com');

// Validando todo o formulário
const formResult = formControl.validateAll();
```

## Validadores Pré-definidos

### CommonValidators

```typescript
// Obrigatório
CommonValidators.required('Campo obrigatório')

// Comprimento mínimo e máximo
CommonValidators.minLength(3, 'Mínimo 3 caracteres')
CommonValidators.maxLength(50, 'Máximo 50 caracteres')

// Email
CommonValidators.email('Email inválido')

// Numérico
CommonValidators.numeric('Deve ser um número')
CommonValidators.min(18, 'Idade mínima 18 anos')
CommonValidators.max(100, 'Idade máxima 100 anos')

// Padrão regex
CommonValidators.pattern(/^\d{5}-?\d{3}$/, 'CEP inválido')

// Customizado
CommonValidators.custom(
    (value) => value.includes('@'),
    'customCheck',
    'Deve conter @'
)

// Assíncrono customizado
CommonValidators.customAsync(
    async (value) => {
        const response = await fetch(`/api/check/${value}`);
        return response.ok;
    },
    'apiCheck',
    'Valor não disponível'
)
```

## Validação Assíncrona

```typescript
const usernameControl = new ValidatorControl([
    CommonValidators.required('Username obrigatório'),
    CommonValidators.customAsync(
        async (value) => {
            // Verificação no servidor
            const response = await fetch(`/api/users/${value}`);
            return !response.ok; // true se username disponível
        },
        'availability',
        'Username já existe'
    )
]);

// Validação assíncrona
const result = await usernameControl.validateAsync();
```

## Hierarquia de Controles

### Controles Pai/Filho

```typescript
const parentControl = new ValidatorControl();
const childControl = new ValidatorControl([
    CommonValidators.required('Campo obrigatório')
]);

// Adicionando filho ao pai
parentControl.addChild(childControl);
// ou
childControl.setParent(parentControl);

// Validação hierárquica
const result = parentControl.validateAll();
```

### Controles Nomeados

```typescript
const formControl = new ValidatorControl();

formControl.addControl('email', emailControl);
formControl.addControl('password', passwordControl);

// Acessando controles específicos
const emailCtrl = formControl.getControl('email');
emailCtrl?.setValue('user@example.com');

// Removendo controle
formControl.removeControl('email');
```

## Notificação de Mudanças

```typescript
const childControl = new ValidatorControl([
    CommonValidators.required('Obrigatório')
]);

parentControl.addChild(childControl);

// Quando o filho muda, notifica o pai
childControl.setValue('novo valor');
childControl.validate();
childControl.notifyParent(); // Dispara validação no pai
```

## Criando Validadores Customizados

### Validador Síncrono

```typescript
const passwordStrengthValidator: IValidator = {
    name: 'passwordStrength',
    message: 'Senha deve ter maiúscula, minúscula e número',
    validator: (value: string) => {
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        
        return hasUpper && hasLower && hasNumber 
            ? ValidationStatus.Valid 
            : ValidationStatus.Invalid;
    }
};
```

### Validador Assíncrono

```typescript
const uniqueEmailValidator: IValidator = {
    name: 'uniqueEmail',
    message: 'Email já está em uso',
    asyncValidator: async (value: string) => {
        try {
            const response = await fetch(`/api/check-email`, {
                method: 'POST',
                body: JSON.stringify({ email: value })
            });
            
            const data = await response.json();
            return data.available 
                ? ValidationStatus.Valid 
                : ValidationStatus.Invalid;
        } catch {
            return ValidationStatus.Invalid;
        }
    }
};
```

## Resultado de Validação

```typescript
interface ValidationResult {
    status: ValidationStatus;
    messages: string[];           // Array de mensagens de erro
    errors: { [validatorName: string]: string }; // Erros por validador
}
```

## Métodos Úteis

```typescript
const control = new ValidatorControl();

// Status
control.isValid()     // boolean
control.isInvalid()   // boolean
control.isPristine()  // boolean
control.getStatus()   // ValidationStatus

// Valores
control.setValue(value)
control.getValue()

// Validação
control.validate()              // ValidationResult
control.validateAsync()         // Promise<ValidationResult>
control.validateAll()           // Valida hierarquia
control.validateAllAsync()      // Valida hierarquia async

// Gerenciamento
control.addValidator(validator)
control.removeValidator(name)
control.reset()                 // Volta para Pristine
```

## Integração com React

```typescript
// Hook customizado para validação
function useValidation(validators: IValidator[], initialValue?: any) {
    const [control] = useState(() => new ValidatorControl(validators, initialValue));
    const [result, setResult] = useState<ValidationResult>();
    
    const validate = useCallback(() => {
        const validationResult = control.validate();
        setResult(validationResult);
        return validationResult;
    }, [control]);
    
    const setValue = useCallback((value: any) => {
        control.setValue(value);
        validate();
    }, [control, validate]);
    
    return { control, result, validate, setValue };
}

// Uso do hook
function EmailInput() {
    const { result, setValue } = useValidation([
        CommonValidators.required('Email obrigatório'),
        CommonValidators.email('Email inválido')
    ]);
    
    return (
        <div>
            <input 
                type="email"
                onChange={(e) => setValue(e.target.value)}
            />
            {result?.status === ValidationStatus.Invalid && (
                <div className="error">
                    {result.messages.join(', ')}
                </div>
            )}
        </div>
    );
}
```

## Exemplos Avançados

Veja o arquivo `example-validators.ts` para exemplos completos de uso incluindo:

- Validação de formulários complexos
- Validação assíncrona
- Hierarquia de controles
- Validadores customizados
- Notificação de mudanças
