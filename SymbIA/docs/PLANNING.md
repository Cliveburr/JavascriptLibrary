# PLANNING.md – Projeto “SymbIA v2” (green‑field)

> **Propósito**  
> Construir, do zero, uma plataforma **multi‑memória** onde cada usuário conversa com agentes LLM que **lembram**, **aprendem** e **executam ações**.  
> A stack é dividida em quatro workspaces (monorepo PNPM) para isolamento claro de _interfaces_, _lógica de domínio_, _API HTTP_ e _front‑end_.

---

## 1. Visão Geral da Arquitetura

```mermaid
graph TD
  subgraph User
    W[Web ‑ React] -->|REST/WS| API
  end

  subgraph Back‑end
    API --> CORE
    CORE -->|types| INT
    API -->|types| INT
  end

  subgraph Infra
    LLM["LLM Gateway\n(OpenAI, Ollama, Azure)"]
    VDB["Vector DB\n(Qdrant)"]
    SQL[(PostgreSQL)]
  end

  CORE -->|embeddings| VDB
  CORE -->|metadata| SQL
  CORE -->|requests| LLM
```

* **/interfaces (INT)** – contratos TypeScript compartilhados.  
* **/core** – regras de negócio, ciclo de pensamento, seletores de modelo.  
* **/api** – Express + Zod; apenas controllers → services do **core**.  
* **/web** – React + Vite + SCSS; design futurista minimalista.

---

## 2. Tecnologias & Padrões

| Camada | Techs / Libs | Padrões |
|--------|-------------|---------|
| **LLM Gateway** | `openai`, `@ollama/client`, `mistralai` | Adapter per provider |
| **Vector DB** | Qdrant (HTTPv1) | Embeddings: `nomic-embed-text` |
| **HTTP API** | Node 18, Express, Zod, ts‑yringe DI | Controllers → Services |
| **Core** | TypeScript, rxjs (fluxo), fp‑ts | Clean Architecture |
| **Web** | React 19, Vite, Zustand, react‑router | Atomic Design |
| **Testes** | Vitest, Supertest, Playwright | TDD + Contract tests |

---

## 3. Módulos & Fluxo de Pensamento do Agente

### 3.1 Ciclo **Observe → Retrieve → Plan → Act → Reflect**

1. **Observe** – recebe mensagem do usuário.  
2. **Retrieve** – busca contexto:  
   * chats recentes (short‑term)  
   * memórias vetoriais (long‑term) ligadas à *memoryId*.  
3. **Plan** – `PlannerService` escolhe:  
   * ferramenta interna (`searchMemory`, `saveMemory` …)  
   * ação externa (schema JSON)  
   * resposta direta.  
   * → usa **Model Selector** (abaixo) para escolher _LLM_ apropriado.  
4. **Act** – executa a ação; envia resultado ao *LLM Responder*.  
5. **Reflect** – gera resumos + novas memórias; salva em VDB.

### 3.2 Seletor de Modelos

```ts
export type LlmSet = "fast-chat" | "reasoning" | "embedding";

const MODEL_MAP = {
  "fast-chat":    { provider: "ollama", model: "phi3"  },
  "reasoning":    { provider: "openai", model: "gpt-4o" },
  "embedding":    { provider: "ollama", model: "nomic-embed-text" }
};

export function pickModel(set: LlmSet) {
  return MODEL_MAP[set];
}
```

* Cada **Action** define `requiredSet`.  
* `LlmGateway` injeta provider/model corretos.

---

## 4. Domínio de Dados

| Entidade | Campos principais | Regras |
|----------|-------------------|--------|
| **User** | `id`, `email`, `passwordHash`, `defaultMemoryId` | defaultMemoryId sempre válido |
| **Memory** | `id`, `userId`, `name`, `createdAt`, `deletedAt?` | usuário ≥ 1 memory ativa |
| **Chat** | `id`, `memoryId`, `title`, `createdAt` | lista por memory |
| **Message** | `id`, `chatId`, `role`, `content`, `contentType`, `toolCall?`, `createdAt` | contentType: `text\|form\|chart\|file` |
| **VectorEntry** | `id`, `memoryId`, `embedding`, `payload` | payload: `{type, tags, timestamp}` |

SQL guarda metadados; embeddings vão para Qdrant (`collection = memoryId`).

---

## 5. Estrutura de Diretórios

```
/
├─ interfaces
│  ├─ src/
│  │  ├─ api.d.ts      # DTOs REST/WS
│  │  ├─ domain.d.ts   # User, Memory, Chat, Message
│  │  └─ llm.d.ts      # LlmSet, ModelSpec
│  └─ tests/
│
├─ core
│  ├─ src/
│  │  ├─ llm/
│  │  │  ├─ selector.ts
│  │  │  └─ providers/{openai,ollama}.ts
│  │  ├─ memory/
│  │  │  ├─ memory.service.ts
│  │  │  └─ reflection.job.ts
│  │  ├─ planner/
│  │  │  └─ planner.service.ts
│  │  ├─ actions/
│  │  │  ├─ saveMemory.action.ts
│  │  │  └─ callTool.action.ts
│  │  └─ index.ts
│  └─ tests/
│
├─ api
│  ├─ src/
│  │  ├─ controllers/
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ memory.controller.ts
│  │  │  ├─ chat.controller.ts
│  │  │  └─ message.controller.ts
│  │  ├─ routes.ts
│  │  └─ server.ts
│  └─ tests/
│
└─ web
   ├─ src/
   │  ├─ components/
   │  │  ├─ chat/
   │  │  ├─ memory-switcher/
   │  │  └─ ui/
   │  ├─ pages/
   │  ├─ hooks/
   │  └─ styles/
   └─ tests/
```

---

## 6. Passos de Implementação

| Sprint | Objetivos | Artefatos |
|--------|-----------|-----------|
| **0 – Setup** | Monorepo PNPM, ESLint/Prettier, Vitest config | CI workflow |
| **1 – Interfaces** | Definir DTOs, enums e tipos base | `/interfaces` publish‑able pkg |
| **2 – Auth & Memory** | CRUD Memory, regras de mínimo 1 ativa | API + Core services |
| **3 – LLM Gateway** | Implementar providers + selector | Mock tests |
| **4 – Thought Cycle MVP** | Observe→Plan→Respond com salvar/buscar memória | Core + unit tests |
| **5 – Frontend MVP** | Login, lista Memory, chat dinâmico (text) | Web pages |
| **6 – Rich Messages** | render de forms, charts; ws live | Message renderer lib |
| **7 – Tool‑calling** | schemas JSON + CallToolAction | Demo: weather |
| **8 – Observabilidade** | OpenTelemetry, logs, metrics | Grafana dashboard |
| **9 – E2E** | Playwright cobrindo auth → chat → remember | GitHub Actions |

---

## 7. Estratégia de Testes

1. **Unitário** (Vitest) – 90 % de coverage em core e interfaces.  
2. **Integração** (Supertest) – API ↔ Core ↔ SQL/Qdrant (test‑containers).  
3. **Contrato** – Schemas Zod gerados & validados no web.  
4. **E2E** (Playwright) – fluxos principais do usuário.  
5. **Load** – Artillery nos endpoints de chat com mock do LLM.

---

## 8. Segurança & Escalabilidade

* **JWT + Refresh** (Auth)  
* **Rate‑limit por memória**  
* **WebSocket fallback → SSE**  
* **Autoscale**: API (K8s HPA) e VDB cluster.  
* **Secret manager** para chaves das LLMs.

---

## 9. Definições de “Pronto”

* Todos testes e lint verdes.  
* Cobertura ≥ 90 % em **core** e **interfaces**.  
* Swagger JSON publicado no endpoint `/docs`.  
* Playground web envia e recebe rich messages sem recarregar.  
* Observabilidade exibe latência p99 < 800 ms para completions _reasoning_.

---

## 10. Roadmap Futuro

| Item | Descrição |
|------|-----------|
| **Multi‑língua** | i18n na UI + prompt locale |
| **Plugins de Ferramenta** | Registry público de schemas |
| **Fine‑tuning** | RAG Agentic com dados de domínio |
| **Mobile** | React Native app compartilhando hooks |

---

> **Próximo passo:** inicializar monorepo, criar `/interfaces` com DTOs de **User**, **Memory**, **Chat** e **Message**, e configurar o CI básico.  
> _Happy building!_
