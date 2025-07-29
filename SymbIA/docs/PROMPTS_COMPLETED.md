# Copilot Chat – Sequência de Prompts para implementar o **SymbIA** do zero

> **Como usar**  
> 1. Abra o Copilot Chat na raiz do monorepo.  
> 2. Copie **um** prompt por vez, execute, revise o diff e _commit_.  
> 3. Rode `pnpm test` / linters antes de avançar.  
> 4. Só então continue para o próximo prompt.

---

## 🔰 SETUP INICIAL

### Prompt 1 – Criar Monorepo & Tooling Básico
```text
# CONTEXTO
Estamos começando o projeto SymbIA do zero.

## TAREFA
1. Inicialize monorepo PNPM com workspaces `/interfaces`, `/core`, `/api`, `/web`.
2. Configure tsconfig base + tsconfig por projeto (extends).
3. Instale & configure:
   - ESLint + Prettier (Airbnb + TypeScript).
   - Vitest + ts‑node.
   - Husky + pre‑commit lint+test.
4. Adicione script `"test"` que roda Vitest em todos pacotes.

## ACEITE
- `pnpm install` sem erros.
- Rodar `pnpm test` executa Vitest (0 testes).
- Lint passa (`pnpm lint`).
```

---

## 🗂️ WORKSPACE **/interfaces**

### Prompt 2 – Definir Tipos de Domínio e DTOs
```text
# CONTEXTO
Criar contrato compartilhado.

## TAREFA
1. Em `/interfaces/src` crie arquivos:
   - `domain.ts`: User, Memory, Chat, Message (segundo PLANNING).
   - `llm.ts`: LlmSet, ModelSpec.
   - `api.ts`: DTOs LoginRequest/Response, MemoryDTO, ChatDTO, MessageDTO.
2. Reexporte tudo em `index.ts`.
3. Adicione testes de type‑checking com Vitest.

## ACEITE
- `pnpm --filter interfaces test` verde.
- Nenhum erro tsc ao rodar `pnpm build` (emitDeclarationOnly).
```

---

## ⚙️ WORKSPACE **/core**

### Prompt 3 – Skeleton do Core + Injeção de Dependência
```text
# CONTEXTO
Vamos iniciar a lógica de domínio.

## TAREFA
1. Crie `/core/src/index.ts` exportando serviços vazios.
2. Instale `tsyringe` e configure container global para DI.
3. Crie pastas `llm/`, `memory/`, `planner/`, `actions/`.
4. Adicione teste simples que resolve container sem erros.

## ACEITE
- `pnpm --filter core test` verde.
```

### Prompt 4 – LLM Gateway & Model Selector
```text
# CONTEXTO
Implementar acesso unificado aos provedores de LLM.

## TAREFA
1. Em `/core/src/llm`:
   - `selector.ts` conforme PLANNING (fast-chat, reasoning, embedding).
   - `providers/openai.ts`, `providers/ollama.ts` com método `invoke(messages, options)`.
   - `LlmGateway.ts` decide provider/model baseado em `LlmSet`.
2. Mock providers nos testes.

## TESTES
- Vitest: selector retorna modelo correto por set.
- Gateway chama provider certo (spy).

## ACEITE
- Cobertura ≥ 90 % em `llm/`.
```

### Prompt 5 – Serviço de Memória Vetorial
```text
# CONTEXTO
Precisamos persistir embeddings por memoryId.

## TAREFA
1. Adicionar `@qdrant/js-client-rest` & `@dqbd/tiktoken`.
2. `memory/qdrant.provider.ts`:
   - `upsert(memoryId, id, vector, payload)`
   - `search(memoryId, vector, topK, filter?)`
3. `memory/embedding.service.ts` usa LlmGateway(`embedding`).

## TESTES
- Mock Qdrant e verifique chamada correta.

## ACEITE
- Nenhum TODO pendente; testes verdes.
```

### Prompt 6 – Ciclo de Pensamento MVP (Observe → Respond)
```text
# CONTEXTO
Queremos uma primeira resposta sem planner.

## TAREFA
1. `ThoughtCycleService`:
   - `handle(userId, memoryId, message)`.
   - Recupera últimas 10 mensagens em SQL (mock) e envia ao LLM (`fast-chat`).
   - Retorna texto da resposta.
2. Sem ações nem memórias ainda.

## TESTES
- Stub LLM; verifica concatenação de contexto.

## ACEITE
- Serviço retorna string ≠ '' em teste.
```

---

## 🛠️ WORKSPACE **/api**

### Prompt 7 – Bootstrap Express & Dependency Injection
```text
# CONTEXTO
Subir API com controllers pattern.

## TAREFA
1. Setup Express + `zod-express-middleware`.
2. Configure container DI para usar serviços do Core.
3. Endpoints:
   - POST `/auth/login`
   - GET `/memories`
   - POST `/memories`
4. Use DTOs de `/interfaces`.

## TESTES
- Supertest cobrindo 100 % dos endpoints.

## ACEITE
- `pnpm --filter api test` verde; server inicia em `pnpm dev`.
```

### Prompt 8 – Regras de Memory (≥1 ativa)
```text
# CONTEXTO
Aplicar regra de negócio.

## TAREFA
1. `MemoryService` (core): CRUD com validações.
2. Controller deve impedir deletar última memória do usuário.
3. Adicione testes (unit e integração).

## ACEITE
- Tentativa de delete única memory devolve 400.
```

### Prompt 9 – Endpoint de Chat + ThoughtCycle
```text
# CONTEXTO
Integrar ciclo MVP.

## TAREFA
1. POST `/chats/:memoryId/messages` (body: content).
2. Chama `ThoughtCycleService.handle` e persiste resposta em SQL.
3. Retorna `MessageDTO` de resposta.

## TESTES
- Supertest simula conversa curta.

## ACEITE
- Latência <800 ms com LLM mock.
```

---

## 💻 WORKSPACE **/web**

### Prompt 10 – Configuração Vite + SCSS + Zustand
```text
# CONTEXTO
Criar front‑end base.

## TAREFA
1. Vite + React + TS.
2. Arquitetura pages/layout/components/hooks.
3. Tema SCSS futurista (variáveis).

## ACEITE
- `pnpm --filter web dev` abre hello world estilizado.
```

### Prompt 11 – Auth & Memory UI
```text
# CONTEXTO
Fluxo mínimo de navegação.

## TAREFA
1. Página Login (email/pass) → token store.
2. Página Dashboard:
   - Sidebar de Memories (fetch GET /memories).
   - Botão add/delete; regras visuais (disable delete se 1).
3. Zustand para auth + memory state.

## TESTES
- Playwright: login, cria memória, deleta (quando >1).

## ACEITE
- UX sem erros; responsivo a 320 px.
```

### Prompt 12 – Chat Dinâmico (texto)
```text
# CONTEXTO
Consumir endpoint de chat.

## TAREFA
1. Componente ChatWindow com scroll infinito mensagens.
2. Campo input + submit → POST message.
3. Rende­ril­za respostas textuais.

## TESTES
- Playwright send/receive 3 mensagens.

## ACEITE
- Sem recarregar página; scroll auto‑to‑bottom.
```

---

## 🔬 AMPLIANDO O CORE

### Prompt 13 – Ações `saveMemory` & `searchMemory`
```text
# CONTEXTO
Adicionar comandos internos.

## TAREFA
1. Implementar Actions no core:
   - `SaveMemoryAction` grava em Qdrant.
   - `SearchMemoryAction` consulta vetores.
2. Implementar `PlannerService` versão 1 com heurística simples via LLM `reasoning`.

## TESTES
- Unit: chamada de ação com spy para Qdrant.
- Integration: pergunta “Qual meu e‑mail?” após salvar deve responder certo.

## ACEITE
- Cobertura core ≥ 85 %.
```

### Prompt 14 – Short‑term Buffer + Resumo
```text
# CONTEXTO
Limitar tokens.

## TAREFA
1. `ShortTermMemoryManager` (buffer 20 msgs).
2. Quando exceder, cria TL;DR via LLM `fast-chat` e salva com `SaveMemoryAction`.

## TESTES
- Buffer size nunca >20.
- TL;DR salvo no vetor.

## ACEITE
- p99 latency +5 % máx.
```

---

## 📊 RICH MESSAGES

### Prompt 15 – Suporte a `contentType`
```text
# CONTEXTO
Renderizar forms e charts.

## TAREFA
1. Extender MessageDTO (`contentType`).
2. Web: renderer switch (Text, FormSurvey, Chart).
3. Exemplo: se mensagem JSON com type `form` crie form dinâmico.

## TESTES
- Unit renderer.
- Playwright: form é exibido e envia resposta.

## ACEITE
- Passa testes; nenhuma regressão nos chats de texto.
```

---

## 🔎 OBSERVABILIDADE & SEC

### Prompt 16 – Logging OpenTelemetry
```text
# CONTEXTO
Rastrear spans.

## TAREFA
1. Configurar OTEL SDK no core e API.
2. Exporter console + OTLP grpc (env).

## ACEITE
- Trace ThoughtCycle > LLM > Qdrant visível.
```

### Prompt 17 – Filtro de Dados Sensíveis
```text
# CONTEXTO
Redaction antes de enviar ao LLM.

## TAREFA
1. Middleware em core que mascara CPF, cartão, e‑mail corporativo.
2. Unit tests de regex.

## ACEITE
- Dados sensíveis não aparecem no mock de provider.
```

---

## 🧪 E2E & PIPELINE

### Prompt 18 – Pipeline CI + Playwright E2E
```text
# CONTEXTO
Garantir qualidade contínua.

## TAREFA
1. GitHub Actions:
   - Instalar PNPM, restore cache.
   - `pnpm test` em todos pacotes.
   - Playwright headless (web + api com mocks).
2. Badge “build” no README.

## ACEITE
- Pipeline verde em branch main.
```
