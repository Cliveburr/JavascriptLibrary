
# Copilot Prompts – Road to Version 1 (SymbIA v2)

> **Contexto inicial:**  
> • Prompts 1‑12 já aplicados (monorepo estruturado, login/Mongo, chat texto básico).  
> • LLM sets configurados (`ollama-local.json`, `ollama-sets.json`).  
> • Novo Thought Cycle de 2 estágios (Decisão → Execução) definido.  
>  
> **Objetivo:** levar o projeto até a **Versão 1** com todas ações internas, DecisionService, renderers e testes completos.

---

## 🔰 BÁSICO DE ACTIONS & DECISION

### Prompt 13 – Interface `ActionHandler` + Context
```text
# CONTEXTO
Adicionar interface comum para handlers de ação.

** Leia o arquivo "docs/THOUGHT-CYCLE.md" para visualizar minuciosamente como o ThoughtCyle deve funcionar **

## TAREFA
1. Em /interfaces/src, crie:
   - actions.ts com:
     export interface ActionContext { userId, memoryId, chatId, sendMessage(), llm, mongo, vector }
     export interface ActionHandler { readonly name: string; readonly enabled: boolean; execute(ctx: ActionContext): Promise<void>; }

2. Exporte via index.ts.

## ACEITE
- `pnpm --filter interfaces build` gera *.d.ts sem erros.
```

### Prompt 14 – ActionRegistry dinâmico
```text
# CONTEXTO
Carregar ações dinamicamente.

** Leia o arquivo "docs/THOUGHT-CYCLE.md" para visualizar minuciosamente como o ThoughtCyle deve funcionar **

## TAREFA
1. /core/src/actions/action.registry.ts:
   - Usar todas actions registrada

2. Adicionar teste Vitest: deve listar `"Finalize"` após implementar stub.

## ACEITE
- Teste passa; lint ok.
```

### Prompt 15 – DecisionService
```text
# CONTEXTO
Decisão de qual ação executar.

** Leia o arquivo "docs/THOUGHT-CYCLE.md" para visualizar minuciosamente como o ThoughtCyle deve funcionar **

## TAREFA
1. /core/src/planner/decision.service.ts:
   - Método decide(userId, memoryId, chatId, message).
   - Monta prompt com histórico (chat-history:true) + getEnabledActionNames().
   - Usa LLM set 'reasoning-heavy' (fallback incluído).
   - Retorna string ação.

2. Teste: mock LLM → resposta "Finalize" → expect same.

## ACEITE
- Coverage DecisionService ≥ 90 %.
```

### Prompt 16 – FinalizeAction (MVP)
```text
# CONTEXTO
Primeira ação executável.

** Leia o arquivo "docs/THOUGHT-CYCLE.md" para visualizar minuciosamente como o ThoughtCyle deve funcionar **

## TAREFA
1. /core/src/actions/finalize.action.ts:
   - Implements ActionHandler.
   - execute(): chama LLM set 'chat' stream on com resposta final.

2. Registrar enabled=true.

## ACEITE
- Envio simples de mensagem final em chat flow manual test.
```

---

## ⚙️ CICLO COMPLETO NO BACK‑END

### Prompt 17 – Orquestração decisão → execução
```text
# CONTEXTO
Conectar tudo no controller.

** Leia o arquivo "docs/THOUGHT-CYCLE.md" para visualizar minuciosamente como o ThoughtCyle deve funcionar **

## TAREFA
1. /api/controllers/message.controller.ts:
   - Após receber msg do usuário:
     a) sendMessage placeholder ("Thinking…", modal text-for-replace).
     b) chama DecisionService.
     c) Recupera handler via ActionRegistry e executa.
2. Remover flow antigo.

## ACEITE
- Post message retorna status 200 e placeholder id.
```

### Prompt 18 – Renderer `TextForReplace`
```text
# CONTEXTO
Frontend precisa substituir placeholder.

## TAREFA
1. /web/components/chat/TextForReplace.tsx.
2. Na store de mensagens, se receber msg com mesmo _id e modal=text-for-replace, substitui conteúdo.

3. Ajustar ChatWindow para usar.

## TESTE
- Playwright: Thinking… troca pela resposta do Finalize.

## ACEITE
- UI sem flicker.
```

---

## 🧠 MEMÓRIA – REPOSITÓRIOS E AÇÕES

### Prompt 19 – MemoryRepository & Vector sync
```text
# CONTEXTO
Persistir e relacionar memórias.

## TAREFA
1. /core/src/memory/memory.repository.ts:
   - CRUD Mongo.
   - syncVectorIds(memoryId, qdrantIds[]).

2. Testes mongo-memory-server.

## ACEITE
- Unit tests verde.
```

### Prompt 20 – MemorySearchAction
```text
# CONTEXTO
Implementar fluxo detalhado.

## TAREFA
1. /core/actions/memory-search.action.ts:
   - Seguir mini‑workflow completo do doc (Buscando… -> reasoning -> embeddings -> Qdrant).
   - Enviar `modal:"memory"` msgs para cada resultado.

2. Teste integra mocks LLM + Qdrant.

## ACEITE
- Busca retorna ≥1 memory card em cenário de teste.
```

### Prompt 21 – MemorySaveAction
```text
# CONTEXTO
Salvar novas informações.

## TAREFA
1. memory-save.action.ts implementación full pipeline.
2. Atualizar Mongo & Qdrant.

## ACEITE
- Test integration: info salva e memória visível em busca posterior.
```

### Prompt 22 – MemoryUpdate & MemoryDelete
```text
# CONTEXTO
Completar CRUD de memórias.

## TAREFA
1. memory-update.action.ts e memory-delete.action.ts.
2. Pipeline conforme doc.

## ACEITE
- Teste unitário cobre update/delete.
```

---

## 💻 RENDERERS AVANÇADOS

### Prompt 23 – MemoryCard renderer
```text
# CONTEXTO
Exibir memórias retornadas.

## TAREFA
1. Componente MemoryCard (props: memory payload).
2. Chat render switch para modal "memory".

## ACEITE
- Card mostra título + snippet; click expande detalhe.
```

---

## 🔍 OBSERVABILIDADE

### Prompt 24 – Tracing por ação
```text
# CONTEXTO
Medições de latência.

## TAREFA
1. Adicionar span OpenTelemetry em DecisionService e cada ActionHandler.
2. Exporter console.

## ACEITE
- Logs mostram decision.duration e action.duration.
```

---

## 🧪 TESTES FINAIS & CI

### Prompt 25 – Suite de testes completos
```text
# CONTEXTO
Cobertura alvo 90 %.

## TAREFA
1. Unit tests faltantes nas novas actions e renderers.
2. Integration MemorySearch e Save.
3. Playwright flow: criar mem → salvar dado → buscar → deletar.

## ACEITE
- `pnpm test` cobertura ≥ 90 %.
```

### Prompt 26 – Pipeline GitHub Actions
```text
# CONTEXTO
CI versão 1.

## TAREFA
1. workflow main:
   - setup PNPM cache
   - lint
   - vitest
   - playwright headless
   - upload coverage badge.

## ACEITE
- Build verde; badge no README.
```

---

> **Após o Prompt 26 concluído, versão 1 estará funcional** com ciclo Decisão→Execução, todas ações de memória, renderização dinâmica e observabilidade básica.
