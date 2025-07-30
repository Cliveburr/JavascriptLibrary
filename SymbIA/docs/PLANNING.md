# PLANNING.md – SymbIA v2 · **Revisão 3**

> **Última atualização:** 2025-07-29  
> Esta revisão alinha o planejamento ao documento **THOUGHT‑CYCLE.md**, que define um c| Sprint | Objetiv#| **9** | Melhorias de performance e estabilidade | 6. Definition of Done

- Placeholder exibido < 300 ms.  
- DecisionService com fallback.  
- Ações enviam mensagens conforme especificação.  
- Chat‑history flag respeitada.  
- p95 < 2 s.-------|
| **4** | DecisionService + ActionRegistry + ação Finalize |
| **5** | Renderer text-for-replace + ciclo simples |
| **6** | MemorySearch & MemorySave |
| **7** | MemoryUpdate & MemoryDelete |
| **8** | Observabilidade (spans por ação) |
| **9** | Melhorias de performance e estabilidade |pensamento com **apenas dois estágios**: **Decisão** e **Execução**. As ações próprias (MemorySearch, MemorySave, etc.) são responsáveis por responder ao usuário — não existe fase separada de “Responder” nem rotina automática de “Reflect & Save”.

---

## 0. Estado do Projeto

| Item | Status |
|------|--------|
| **Prompts aplicados** | 1 ‑ 12 concluídos |
| **Auth & MongoDB** | ✅ Integrado |
| **Qdrant** | ✅ Instância local + client |
| **LLM Sets (Ollama)** | ✅ `ollama‑local.json` + `ollama‑sets.json` |
| **Thought Cycle v2** | 🔨 Em implementação (esta revisão) |

---

## 1. Arquitetura Geral

```mermaid
graph TD
  subgraph Front‑end
    W[Web – React] -->|REST + WS| API
  end

  subgraph Back‑end
    API --> CORE
    CORE --> MONGO[(MongoDB)]
    CORE --> VDB[(Qdrant)]
    CORE --> LLM["LLM Gateway (Ollama)"]
    API -->|types| INT[(Interfaces)]
    CORE --> INT
  end
```

---

## 2. Formatos de Dados

### 2.1 Estrutura das mensagens

```jsonc
{
  "chat-history": boolean,
  "modal": "text" | "text-for-replace",
  "role": "user" | "assistant" | "system",
  "content": any
}
```

### 2.2 Documento Memory (MongoDB)

```jsonc
{
  "_id": "ObjectId",
  "memoriesId": "ObjectId",
  "vectorIds": ["uuid"],
  "type": "text",
  "content": any
}
```

### 2.3 Entrada Vetorial (Qdrant payload)

```jsonc
{ "nosqlId": "ObjectId" }
```

---

## 3. Thought Cycle v2 – 2 Estágios

```
User Msg
  │
  ▼
① DECISÃO  (LLM set: reasoning‑heavy)
  │  → placeholder "Thinking…"  [modal=text-for-replace]
  ▼
② EXECUÇÃO (handler da ação)
  │  • envia mensagens intermediárias
  │  • produz mensagens finais (modal=text ou memory)
  ▼
[Fim do ciclo]
```

### 3.1 Decisão

* Prompt = mensagem original + histórico `chat-history:true` + lista de ações habilitadas.  
* Modelo: `reasoning-heavy` (`functionary-small-v3.1`; fallback `llama3:8b`).  
* Responde **apenas** com o nome da ação.  
* Placeholder exibido enquanto decide:

```jsonc
{ "chat-history": false, "modal": "text-for-replace", "content": "Thinking..." }
```

### 3.2 Execução

Cada ação executa seu próprio mini‑workflow (vide THOUGHT‑CYCLE). Mensagens `text-for-replace` indicam progresso; mensagens finais variam.


---

## 4. Ações internas (extensíveis)

### 4.1 Interface `ActionHandler`

```ts
// interfaces/src/actions.ts
export interface ActionHandler {
  /** nome único usado pelo DecisionService */
  readonly name: string;
  /** se == false o DecisionService ignora */
  readonly enabled: boolean;
  /** mini‑workflow da ação; deve enviar as mensagens no chat */
  execute(ctx: ActionContext): Promise<void>;
}
```

*`ActionContext` inclui: `user`, `memoryId`, `chatId`, helpers `sendMessage()`, `llm.*`, `vector.*`, `mongo.*`.*

### 4.2 ActionRegistry

```ts
// core/actions/action.registry.ts
import * as registry from './*.action';
export const actions = Object.values(registry).filter(a => a.enabled);

export function getEnabledActionNames() {
  return actions.map(a => a.name);
}
```

*Adicionar nova ação = criar arquivo `my-feature.action.ts` exportando uma classe que implementa `ActionHandler`.*

### 4.3 Mini‑workflows detalhados

| Ação | Quando decidir | Passos resumidos |
|------|----------------|------------------|
| **Finalize** | Nenhuma outra ação se aplica | 1. `Thinking…` → 2. LLM `chat` *stream on* com resposta final. |
| **Question** | Precisa de info extra do usuário | 1. `Thinking…` → 2. LLM `chat` *stream on* com pergunta. |
| **MemorySearch** | Precisa de memória existente | 1. `Buscando…` (replace) → 2. LLM `reasoning` gera _queries[]_ → 3. LLM `embedding` → 4. Qdrant search → 5. Para cada hit, `modal:"memory"` (chat‑history:true) → 6. LLM `chat` stream explicando resultado. |
| **MemorySave** | Info explícita deve ser salva | 1. `Salvando…` → 2. LLM `reasoning` gera _bindings[]_ → 3. Embeddings → 4. Mongo insert → 5. Qdrant upsert → 6. LLM `chat` confirma. |
| **MemoryUpdate** | Conteúdo da memória precisa ajuste | 1. `Atualizando…` → 2. LLM `reasoning` gera lista `{{_id, content}}` → 3. Mongo update → 4. LLM `chat` confirma. |
| **MemoryDelete** | Usuário pede remoção de memória | 1. `Apagando…` → 2. LLM `reasoning` gera lista `_ids[]` → 3. Mongo delete + Qdrant delete → 4. LLM `chat` confirma. |

*Cada passo que leva tempo envia uma mensagem `modal:"text-for-replace"` atualizando o status (conforme documento).*

---

## 4. Componentes

| Componente | Caminho | Função |
|------------|---------|--------|
| `DecisionService` | `core/planner` | Monta prompt e chama LLM. |
| `ActionRegistry` | `core/actions` | Metadados `{ name, enabled, handler }`. |
| `*ActionHandler` | `core/actions/*` | Implementações MemorySearch, Save, etc. |
| `mongo.memory.repository.ts` | `core/memory` | CRUD nosql + sync vectorIds. |
| `TextForReplace` renderer | `web/components/chat` | Substitui conteúdo in‑place. |
| `MemoryCard` renderer | `web/components/chat` | Exibe memórias recuperadas. |
| `message.controller.ts` | `api/controllers` | Orquestra decisão → execução. |

---

## 5. Roadmap Atualizado

| Sprint | Objetivo |
|--------|----------|
| **4** | DecisionService + ActionRegistry + ação Finalize |
| **5** | Renderer text-for-replace + ciclo simples |
| **6** | MemorySearch & MemorySave |
| **7** | MemoryUpdate & MemoryDelete |
| **8** | Observabilidade (spans por ação) |
| **9** | Testes (≥90 % coverage) + Playwright |

---

## 6. Testes

* **Unit**: DecisionService, cada ActionHandler (mocks Mongo/Qdrant/LLM).  
* **Integração**: fluxo completo MemorySearch.  
* **E2E**: UI Thinking… → resposta.  
* **Contrato**: saída LLM pertence a enum(ActionRegistry).

---

## 7. Definition of Done

- Placeholder exibido < 300 ms.  
- DecisionService com fallback.  
- Ações enviam mensagens conforme especificação.  
- Chat‑history flag respeitada.  
- Coverage ≥ 90 %.  
- p95 < 2 s.

---

### Próximos Passos

1. Gerar prompts Copilot para DecisionService + ActionRegistry.  
2. Implementar renderer `TextForReplace` na web.  
3. Configurar integração com LLM providers.

