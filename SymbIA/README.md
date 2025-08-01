# SymbIA - AI Assistant

Um assistente de IA inteligente construído com arquitetura modular usando TypeScript, React e Node.js.

## Pré-requisitos

- Node.js 18.19.0 ou superior
- pnpm 9.0.0 ou superior

## Configuração Inicial

1. Instale as dependências:
```bash
pnpm install
```

## Scripts Disponíveis

### Tasks do VS Code

Use as seguintes tasks através do VS Code (Ctrl+Shift+P → "Tasks: Run Task"):

- **Clean**: Limpa as pastas "dist" de todos os projetos
- **Install**: Instala dependências de forma paralela em todos os projetos  
- **StartApi**: Inicia o build em modo watch do `/core` (compilação TypeScript)
- **StartApiServer**: Inicia o servidor da API (depende da task "StartApi")
- **StartWeb**: Inicia o build em modo watch do `/web` e roda o projeto (depende da "StartApiServer")
- **Prod**: Compila todos os projetos em modo produção
- **Launch**: Vinculado ao Launch do VS Code, lança apenas o Chrome (depende da "StartWeb")

### Scripts via linha de comando

```bash
# Limpar todas as pastas dist
pnpm run clean

# Instalar dependências
pnpm run install

# Build de produção
pnpm run build:prod

# Iniciar API em desenvolvimento
pnpm run start:api

# Iniciar Web em desenvolvimento
pnpm run start:web
```

## Estrutura do Projeto

- `core/` - Lógica de negócio e serviços principais
- `api/` - Servidor HTTP API
- `web/` - Interface React frontend
- `docs/` - Documentação do projeto

## Desenvolvimento

1. Use a task **StartWeb** no VS Code para iniciar o ambiente completo de desenvolvimento
2. A API estará disponível em `http://localhost:3002`
3. O frontend estará disponível em `http://localhost:3001`

## Debug

Use as configurações de launch do VS Code:
- **Launch Chrome & Attach**: Inicia o Chrome e anexa o debugger
- **Debug API Server**: Debug do servidor API
- **Debug Full Stack**: Debug completo da aplicação
