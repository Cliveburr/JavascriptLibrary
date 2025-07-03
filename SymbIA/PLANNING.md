# PLANNING

## Goal
Adapt the SymbIA project to follow a structured "Thought Chain" execution cycle:
→ Receive full input context  
→ Decide next action  
→ Execute action (memory-based or cycle control)  
→ Log and append result to current cycle  
→ Repeat until finalization

---

## Modules to Create/Edit

### 1. `thoughtCycle.js`
- `startCycle(ctx)`  
  Entry point. Coordinates the decision-action loop. Receives:
  - `originalMessage: string`
  - `previousMessages: string[]`
  - `executedActions: object[]`
- `decideNextAction(ctx)`  
  Uses full context to determine next action using LLM.

---

### 2. Action Handlers
Each receives `ctx` (context) and `data` (from LLM decision).

- `finalizeCycle(ctx, result)`  
  - Summarizes all actions in current cycle using LLM  
  - Displays `@Display: Summary from LLM`  
  - Returns text to user

- `saveMemory(ctx, data)`  
  - Logs `@Display: Preparing memory to save...`  
  - Uses LLM to extract isolated memory contexts  
  - Generates embeddings  
  - Persists each to NoSQL + vector DB  
  - Summarizes with `@Display: Memory saved!`

- `editMemory(ctx, data)`  
  - Logs `@Display: Preparing memory to edit...`  
  - Uses LLM to identify edits and new content  
  - Updates NoSQL  
  - Summarizes with `@Display: Memory saved!`

- `deleteMemory(ctx, data)`  
  - Logs `@Display: Preparing to delete memory...`  
  - Uses LLM to list deletions  
  - Deletes from NoSQL and vector DB  
  - Logs `@Display: Memory deleted!`

- `searchMemory(ctx, data)`  
  - Logs `@Display: Preparing to search memory...`  
  - Uses LLM to build search context  
  - Generates embeddings if needed  
  - Queries vector DB, fetches from NoSQL  
  - Logs `@Display: Memory retrieved!`

---

## Future Extensions (placeholders)

- `createRelation(ctx, data)`
- `editRelation(ctx, data)`
- `deleteRelation(ctx, data)`
- `useTool(ctx, data)`

---

## LLM Integration Responsibilities

- Action decision
- Action summaries
- Isolated memory extraction
- Embedding generation (mock/stub or connect later)
- User-facing explanations
- Relational reasoning (future)

---

## Data Storage

- **NoSQL**: memory objects (MongoDB or stub)  
- **Vector DB**: embedding storage with pointer to NoSQL ID

---

## Execution Flow

```js
while (!done) {
  log("@Display: Thinking...");
  const decision = await decideNextAction(ctx);
  const result = await performAction(decision.action, ctx, decision.data);
  ctx.executedActions.push({ action: decision.action, result });
  if (decision.action === 'finalize') break;
}
```

---
