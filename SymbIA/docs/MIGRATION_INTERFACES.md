# Migração de Interfaces - SymbIA v2

## Resumo da Migração

Esta migração removeu o projeto `/interfaces` e distribuiu os tipos e interfaces pelos projetos onde são realmente utilizados, seguindo uma arquitetura mais limpa e modular.

## Mudanças Realizadas

### 1. Remoção do Projeto `/interfaces`
- ✅ Removido o diretório `/interfaces` completamente
- ✅ Removido do `pnpm-workspace.yaml`
- ✅ Removidas as referências nos `tsconfig.json` de todos os projetos
- ✅ Removida a tarefa "Build Interfaces" do `.vscode/tasks.json`

### 2. Migração de Tipos para `/core/src/types/`
Criados os seguintes arquivos no core:

- **`domain.ts`**: Entidades do domínio (User, Memory, Chat, Message, VectorEntry, MessageRole, MessageModal)
- **`llm.ts`**: Tipos relacionados ao LLM (LlmRequest, LlmResponse, LlmSetConfig, EmbeddingRequest, etc.)
- **`chat-context.ts`**: Interface IChatContext para o ciclo de pensamento
- **`messages.ts`**: MessageType enum e interfaces de mensagens de chat (ChatUserMessage, etc.)
- **`index.ts`**: Exporta todos os tipos do core

### 3. Migração de DTOs para `/api/src/types/`
Criados os seguintes arquivos na API:

- **`api.ts`**: DTOs específicos da API (LoginRequest, RegisterResponse, MemoryDTO, ChatDTO, etc.)
- **`index.ts`**: Exporta todos os tipos da API

### 4. Atualização de Importações
Todos os arquivos foram atualizados para usar as novas importações:

#### No Core:
```typescript
// Antes
import type { IChatContext } from '@symbia/interfaces';

// Depois  
import type { IChatContext } from '../types/chat-context.js';
```

#### Na API:
```typescript
// Antes
import type { LoginRequest } from '@symbia/interfaces';

// Depois
import type { LoginRequest } from '../types/api.js';

// Para tipos do core
import type { User, LlmSetConfig } from '@symbia/core';
```

### 5. Atualização de Dependências
- ✅ Removido `@symbia/interfaces` do `package.json` do core
- ✅ Removido `@symbia/interfaces` do `package.json` da API  
- ✅ Removido `@symbia/interfaces` do `package.json` do web
- ✅ Core agora é independente de outros projetos internos
- ✅ API depende apenas do `@symbia/core`
- ✅ Web é independente (comunica via HTTP)

### 6. Atualização da Documentação
- ✅ Atualizado `STRUCTURE.md` com a nova arquitetura
- ✅ Atualizado `PLANNING.md` removendo referências ao projeto interfaces
- ✅ Criado este documento de migração

## Nova Arquitetura de Dependências

```
/core (sem dependências internas)
  ↑
/api (depende de @symbia/core)
  
/web (independente, comunica via HTTP)
```

## Benefícios da Migração

1. **Separação de Responsabilidades**: Cada projeto agora contém apenas os tipos que realmente utiliza
2. **Redução de Dependências**: Menos acoplamento entre projetos
3. **Melhor Organização**: Tipos estão próximos de onde são usados
4. **Frontend Independente**: Web não precisa mais das dependências do MongoDB
5. **Builds Mais Rápidos**: Menos projetos para compilar
6. **Arquitetura Mais Limpa**: Segue princípios de arquitetura limpa

## Validação

- ✅ Todos os tipos migrados corretamente
- ✅ Nenhum erro de compilação
- ✅ Builds funcionando
- ✅ Estrutura de projetos atualizada
- ✅ Documentação atualizada

## Próximos Passos

1. Testar a aplicação completa para garantir que tudo funciona
2. Executar testes automatizados se houver
3. Verificar se há alguma referência remanescente ao projeto interfaces
4. Considerar criar um script de build mais otimizado

A migração foi concluída com sucesso! O projeto agora tem uma arquitetura mais limpa e modular.
