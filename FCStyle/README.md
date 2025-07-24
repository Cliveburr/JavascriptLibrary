# FCStyle Framework

Um framework CSS em React com componentes reutilizáveis e customizáveis via variáveis SCSS.

## Estrutura do Projeto

```
/project     - Framework principal (componentes React + SCSS)
/editor      - Editor React para visualizar e customizar componentes
```

## Como usar

### 1. Instalar dependências
```bash
npm run install:all
```

### 2. Build do projeto principal
```bash
npm run build:project
```

### 3. Executar editor
```bash
npm run dev:editor
```

### 4. Ou executar tudo junto
```bash
npm start
```

## Componentes Disponíveis

### Grid System
- **Column**: Layout flexível em colunas
- **Row**: Layout flexível em linhas

### Components
- **Button**: Botões customizáveis com diferentes estilos e tamanhos

### Form
- **Input**: Campo de entrada com validação
- **InputField**: Campo completo com label e mensagens de validação

### Validation
- **ValidatorControl**: Sistema de validação robusto
- **ValidationStatus**: Estados de validação (Pristine, Valid, Invalid)
- **IValidator**: Interface para validadores customizados

## Editor

O editor permite:
- Visualizar todos os componentes interativamente
- Customizar variáveis CSS em tempo real
- Exportar temas personalizados
- Ver exemplos de código para cada componente

Acesse em: http://localhost:5173 após executar `npm run dev:editor`

## Desenvolvimento

### Scripts disponíveis:
- `npm run build:project` - Build do framework
- `npm run dev:project` - Desenvolvimento com watch
- `npm run build:editor` - Build do editor
- `npm run dev:editor` - Servidor de desenvolvimento do editor
- `npm run build:all` - Build completo
- `npm start` - Build do projeto + executar editor

### Estrutura de pastas:

#### /project
```
src/
  components/     - Componentes React (Button, etc)
  grid/          - Sistema de grid (Column, Row)
  form/          - Componentes de formulário (Input, InputField)
  validator/     - Sistema de validação
  styles/        - Estilos SCSS com variáveis customizáveis
```

#### /editor
```
src/
  components/    - Componentes do editor (Layout, Navigation, ThemeCustomizer)
  pages/         - Páginas de demonstração dos componentes
  styles/        - Estilos específicos do editor
```

## Customização

Use o **ThemeCustomizer** no editor para alterar:
- Cores primárias, secundárias, etc.
- Tamanhos de fontes
- Espaçamentos
- E exportar o tema como JSON

## Exemplo de uso no projeto

```tsx
import { Button, Column, Row, Input, ValidatorControl, ValidationStatus } from 'fcstyle'

// Validator
const emailValidator = new ValidatorControl([
  {
    validator: (value: string) => 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
        ? ValidationStatus.Valid 
        : ValidationStatus.Invalid,
    message: 'Email inválido'
  }
])

// Componente
function MyForm() {
  return (
    <Column gap="large">
      <Row>
        <Button primary>Primary</Button>
        <Button secondary>Secondary</Button>
      </Row>
      <Input 
        type="email" 
        placeholder="Digite seu email"
        validatorControl={emailValidator}
      />
    </Column>
  )
}
```
