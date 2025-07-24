# FCStyle

Framework CSS em React para ser utilizado por outros projetos React.

## Instalação

```bash
npm install fcstyle
```

## Uso Básico

```jsx
import React from 'react';
import { Column, Row, Button } from 'fcstyle';

function App() {
  return (
    <Column>
      <Button primary>This is the primary button!</Button>
      <Button second>This is the second button!</Button>
    </Column>
  );
}

export default App;
```

## Componentes

### Grid Components

#### Column
Componente que define display flex para colunas.

```jsx
<Column inverse={false}>
  {/* Conteúdo */}
</Column>
```

**Props:**
- `children`: React.ReactNode - Conteúdo do componente
- `inverse?: boolean` - Inverte a direção das colunas (column-reverse)
- `className?: string` - Classes CSS adicionais
- `style?: React.CSSProperties` - Estilos inline

#### Row
Componente que define display flex para linhas.

```jsx
<Row inverse={false}>
  {/* Conteúdo */}
</Row>
```

**Props:**
- `children`: React.ReactNode - Conteúdo do componente
- `inverse?: boolean` - Inverte a direção das linhas (row-reverse)
- `className?: string` - Classes CSS adicionais
- `style?: React.CSSProperties` - Estilos inline

### Components

#### Button
Componente de botão com estilos predefinidos.

```jsx
<Button primary>Primary Button</Button>
<Button second>Secondary Button</Button>
```

**Props:**
- `children`: React.ReactNode - Conteúdo do botão
- `primary?: boolean` - Aplica estilo primário
- `second?: boolean` - Aplica estilo secundário
- `className?: string` - Classes CSS adicionais
- Herda todas as props de `HTMLButtonElement`

## Customização de Tema

O FCStyle utiliza variáveis CSS para permitir customização completa dos estilos. Você pode alterar as variáveis globalmente ou aplicar um tema customizado.

### Aplicar Tema Programaticamente

```jsx
import { applyTheme, defaultTheme } from 'fcstyle';

// Aplicar tema customizado
const customTheme = {
  '--fcstyle-display-gap': '24px',
  '--fcstyle-button-primary-bg': '#28a745',
  '--fcstyle-button-primary-hover-bg': '#218838',
  // ... outras variáveis
};

applyTheme(customTheme);
```

### Variáveis CSS Disponíveis

#### Grid
- `--fcstyle-display-gap`: Gap entre elementos nos componentes Column e Row (padrão: 16px)

#### Button
- `--fcstyle-button-primary-bg`: Cor de fundo do botão primário
- `--fcstyle-button-primary-color`: Cor do texto do botão primário
- `--fcstyle-button-primary-border`: Borda do botão primário
- `--fcstyle-button-primary-hover-bg`: Cor de fundo do botão primário no hover
- `--fcstyle-button-primary-hover-border`: Borda do botão primário no hover
- `--fcstyle-button-second-bg`: Cor de fundo do botão secundário
- `--fcstyle-button-second-color`: Cor do texto do botão secundário
- `--fcstyle-button-second-border`: Borda do botão secundário
- `--fcstyle-button-second-hover-bg`: Cor de fundo do botão secundário no hover
- `--fcstyle-button-second-hover-border`: Borda do botão secundário no hover
- `--fcstyle-button-padding`: Padding interno dos botões
- `--fcstyle-button-border-radius`: Border radius dos botões
- `--fcstyle-button-font-size`: Tamanho da fonte dos botões
- `--fcstyle-button-font-weight`: Peso da fonte dos botões
- `--fcstyle-button-transition`: Transição dos botões

### Customização via CSS

Você também pode customizar as variáveis diretamente no seu CSS:

```css
:root {
  --fcstyle-display-gap: 20px;
  --fcstyle-button-primary-bg: #ff6b6b;
  --fcstyle-button-primary-hover-bg: #ff5252;
}
```

## Build

Para fazer o build do projeto:

```bash
npm run build
```

## Desenvolvimento

Para desenvolvimento com watch mode:

```bash
npm run dev
```
