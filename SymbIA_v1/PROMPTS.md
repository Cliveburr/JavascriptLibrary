# SymbIA – Sequência de Prompts para GitHub Copilot Chat

Esta sequência de 12 prompts deve ser usada **na ordem** para completar as funcionalidades restantes do agente SymbIA.  
Fluxo sugerido: copie um prompt ➜ execute no Copilot Chat ➜ revise/aceite as mudanças ➜ _commit_ ➜ prossiga para o próximo prompt.

---

## 🟢 FASE 1 – Persistência de Memória Vetorial
### Prompt 1 – Integrar `SaveMemoryAction` ao Qdrant
```text
# CONTEXTO
Estamos no projeto SymbIA (Node + TypeScript).
Precisamos concluir a gravação de memórias long‑term no Qdrant.

## TAREFA
1. Em src/actions/SaveMemoryAction.ts:
   - Receba `text` e `metadata` do payload.
   - Gere embedding via EmbeddingService.getEmbedding(text).
   - Monte payload: { type: "episodic", timestamp: Date.now(), ...metadata }.
   - Use QdrantProvider.upsert(<id>, embedding, payload).

2. Remova o TODO "simulateSave" e retorne `success: true | false`.

## ACEITE
- Nova memória aparece na coleção 'agent_memory' (vector_size = 768).
- Nenhum ESLint ou teste quebrado.
```

### Prompt 2 – Implementar `SearchMemoryAction` real
```text
# CONTEXTO
Agora precisamos buscar memórias gravadas.

## TAREFA
1. Em src/actions/SearchMemoryAction.ts:
   - Receba `query` string + filtros opcionais.
   - Gere embedding da query.
   - Use QdrantProvider.search(embedding, top_k=5, filter) e devolva hits resumidos.

2. Se não encontrar nada, retorne lista vazia.

## ACEITE
- Chamada ‘searchMemory’ devolve resultados coerentes quando já existe conteúdo.
- Tempo de resposta < 300 ms para coleção de até 10 k itens (simule com mock).
```

---

## 🟡 FASE 2 – Memória de Curto Prazo & Reflexão
### Prompt 3 – Criar `ShortTermMemoryManager`
```text
# CONTEXTO
Precisamos limitar tokens no contexto e resumir histórico.

## TAREFA
1. Crie src/memory/ShortTermMemoryManager.ts:
   - Mantenha buffer FIFO de máx. 20 mensagens.
   - Método addMessage(role, content).
   - Método getContext() concatena últimas N msgs + TL;DR (se houver).

2. Quando buffer > 20:
   - Gere resumo chamando LLMManager.summarize(messages).
   - Armazene TL;DR em vetor usando SaveMemoryAction.

3. Substitua uso direto do histórico no ThoughtCycleService por getContext().

## ACEITE
- Buffer nunca ultrapassa 20 mensagens brutas.
- Resumo é salvo no vetor e recuperável via SearchMemoryAction.
```

### Prompt 4 – Job de “Reflect & Write”
```text
# CONTEXTO
Queremos promover conclusões importantes para long‑term mem assíncronamente.

## TAREFA
1. Crie src/jobs/ReflectAndWriteJob.ts:
   - Cron a cada 15 min (node-cron).
   - Pegue mensagens “assistant” das últimas 2 h com tag needs_reflection.
   - Resuma cada uma e salve no Qdrant (type: 'procedural').

2. Marque item como refletido no firestore/local DB para não repetir.

## ACEITE
- Logs mostram execução a cada 15 min.
- Memórias procedurais aparecem com tag 'reflection'.
```

---

## 🟠 FASE 3 – Ferramentas Externas & Tool‑calling
### Prompt 5 – Loader de Schemas de Ferramenta
```text
# CONTEXTO
Precisamos registrar ferramentas externas via JSON schema.

## TAREFA
1. Crie pasta tools/ com .json por API (ex.: weather.json, sql.json).
   - Campos: name, description, parameters.

2. Crie src/tools/ToolRegistry.ts:
   - Carrega todos .json da pasta.
   - Exponha getToolSchemas().

3. Atualize DecisionService para inserir lista de schemas no prompt.

## ACEITE
- Adicionar novo arquivo .json reflete automaticamente nos prompts.
```

### Prompt 6 – `CallToolAction` Genérico
```text
# CONTEXTO
Agora executaremos qualquer ferramenta registrada.

## TAREFA
1. Crie src/actions/CallToolAction.ts:
   - Recebe 'toolName' + 'args'.
   - Valide se toolName existe no ToolRegistry.
   - Despache para executors/<toolName>.ts (crie pattern loader dinâmico).

2. Exemplo mínimo: weather executor fake que devolve string.

## ACEITE
- DecisionService pode escolher {"action":"callTool","data":{...}} e fluxo roda.
```

---

## 🟣 FASE 4 – Observabilidade & Segurança
### Prompt 7 – Middleware de Logging (OpenTelemetry)
```text
# CONTEXTO
Adicionar tracing.

## TAREFA
1. Setup @opentelemetry/node e exporters/console.
2. Crie middleware que loga: userId, action, duration, token_cost.

## ACEITE
- Traces visíveis no console com spans ThoughtCycle > Action.
```

### Prompt 8 – Filtro de Dados Sensíveis
```text
# CONTEXTO
Evitar envio de chaves/CPFs ao LLM.

## TAREFA
1. Crie src/middleware/SecurityFilter.ts:
   - Regex simples para números de cartão, CPF, e-mail corporativo.
   - Se encontrar, substitua por “[REDACTED]” antes de mandar ao LLM.

## ACEITE
- Teste unitário confirma redaction.
```

---

## 🔵 FASE 5 – Testes & Configuração
### Prompt 9 – Configurar `.env` + Provider Injections
```text
# CONTEXTO
Centralizar configuração.

## TAREFA
1. Adicione dotenv e carregue no bootstrap.
2. Pegue QDRANT_URL, OLLAMA_URL, OTEL_EXPORTER env vars.
3. Atualize README com exemplo .env.sample.

## ACEITE
- Rodar `npm run start` sem variáveis gera erro claro.
```

### Prompt 10 – Suite Unitária de Ações
```text
# CONTEXTO
Cobrir Save/Search/CallTool.

## TAREFA
1. Instalar Vitest + ts‑jest.
2. Mocks para EmbeddingService e QdrantProvider.
3. Escreva testes (≥ 90 % cobertura nas ações).

## ACEITE
- `npm run test` verde.
```

### Prompt 11 – Teste de Integração “Aprendizado”
```text
# CONTEXTO
Garantir que o agente lembra entre ciclos.

## TAREFA
1. Script e2e:
   - Envia mensagem “Meu aniversário é 4 de abril”.
   - Depois de reflet, pergunta “Quando é meu aniversário?”.
   - Espera resposta correta.

## ACEITE
- Passa 3 vezes consecutivas.
```

### Prompt 12 – Remover `normalizeEmbeddingSize`
```text
# CONTEXTO
Agora usamos vector_size = 768.

## TAREFA
1. Apague função normalizeEmbeddingSize().
2. Verifique todos os lugares que usam e ajuste.

## ACEITE
- build sucesso; nenhum teste quebrado.
```
