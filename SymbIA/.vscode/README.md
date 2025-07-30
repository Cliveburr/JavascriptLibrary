# VS Code Configuration - SymbIA

Este diretório contém as configurações do VS Code para o projeto SymbIA, otimizadas para desenvolvimento full-stack.

## Workflow de Desenvolvimento

### 1. Iniciar o Ambiente de Desenvolvimento
- **Ctrl+B**: Inicia o modo watcher para API e Web
  - Executa a task "Dev: API + Web" 
  - Roda `pnpm --filter @symbia/api dev` e `pnpm --filter @symbia/web dev` em paralelo
  - API fica disponível em http://localhost:3002
  - Web fica disponível em http://localhost:3001

### 2. Debug no Browser
- **F5**: Abre o Chrome e faz attach automático para debug
  - Executa a configuração "Launch Chrome & Attach"
  - Abre Chrome com remote debugging na porta 9222
  - Permite debug do código TypeScript/JavaScript do frontend

### 3. Atalhos Adicionais
- **Ctrl+Shift+B**: Abre Chrome manualmente para debug
- **Ctrl+Shift+D**: Inicia debug full-stack (API + Web)

## Configurações de Debug Disponíveis

1. **Launch Chrome & Attach** (Padrão F5)
   - Abre Chrome e conecta para debug do frontend
   
2. **Attach to Web (Chrome)**
   - Conecta a uma instância do Chrome já aberta com debug
   
3. **Debug API Server**
   - Debug do servidor Node.js/Express
   
4. **Debug Tests**
   - Debug dos testes com Vitest
   
5. **Debug Web (Chrome/Edge)**
   - Debug direto do frontend
   
6. **Debug Full Stack**
   - Debug simultâneo de API e Web

## Tasks Disponíveis

- **Dev: API + Web** (Padrão Ctrl+B): Modo watcher para desenvolvimento
- **Build All**: Build completo do projeto
- **Watch API**: Apenas watcher da API
- **Watch Web**: Apenas watcher do Web
- **Test All**: Executar todos os testes
- **Lint All**: Executar linting
- **Launch Chrome Debug**: Abrir Chrome para debug

## Estrutura de Arquivos

- `launch.json`: Configurações de debug
- `tasks.json`: Configurações de tasks/build
- `settings.json`: Configurações do workspace
- `keybindings.json`: Atalhos personalizados
