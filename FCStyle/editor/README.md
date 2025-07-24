# FCStyle Editor

Editor em React para customizar e visualizar todos os componentes do framework FCStyle.

## Estrutura

O editor contém páginas para demonstrar cada componente:

- **Home**: Visão geral do framework
- **Button**: Demonstração do componente Button com todas as variações
- **Column**: Layout flexível em colunas
- **Row**: Layout flexível em linhas  
- **Input**: Campo de entrada com validação
- **InputField**: Campo completo com label e mensagens

## Como executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Dependências

O editor depende dos componentes construídos na pasta `../project`. Certifique-se de que o projeto principal foi buildado antes de executar o editor:

```bash
cd ../project
npm run build
cd ../editor
npm run dev
```

## Estrutura de arquivos

```
src/
  components/
    Layout.tsx          # Layout principal com navegação
    Navigation.tsx      # Menu lateral
  pages/
    Home.tsx           # Página inicial
    components/
      ButtonPage.tsx   # Demonstração do Button
    grid/
      ColumnPage.tsx   # Demonstração do Column
      RowPage.tsx      # Demonstração do Row
    form/
      InputPage.tsx        # Demonstração do Input
      InputFieldPage.tsx   # Demonstração do InputField
  styles/
    index.scss         # Estilos principais
    components/        # Estilos específicos do editor
```

## Funcionalidades

- Navegação entre diferentes componentes
- Demonstração visual de cada componente
- Exemplos de código para cada uso
- Importação dos estilos SCSS do projeto principal
- Layout responsivo
- Showcase interativo dos componentes
