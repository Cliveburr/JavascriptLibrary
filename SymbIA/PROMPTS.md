# VSCode Copilot Prompts – SymbIA Thought Chain Upgrade (Detailed)

---

## Prompt 1 – Create Cycle Core

Read the file PLANNING.md to know the full changes and do the first part bellow

Create a new file called `thoughtCycle.js`. In this file:

- Define an exported function `startCycle(ctx)` that takes one argument `ctx`, which is an object containing:
  - `originalMessage`: the user's original message (string)
  - `previousMessages`: an array of prior messages (strings)
  - `executedActions`: an array of actions already performed during this cycle

- Inside `startCycle`, write a `while` loop that does the following:
  - Logs `@Display: Thinking...` to simulate thinking step
  - Calls the function `decideNextAction(ctx)` (create as a stub)
  - Gets the returned `{ action, data }` object
  - Based on `action`, calls the appropriate handler function (e.g., `saveMemory(ctx, data)`)
  - Pushes the result into `ctx.executedActions`
  - If `action` is `"finalize"`, break the loop

- Export both `startCycle` and `decideNextAction`

---

## Prompt 2 – Implement Decision Function

Implement the function `decideNextAction(ctx)`:

- This function is responsible for deciding what to do next based on the context.
- It should:
  - Combine the data from `ctx.originalMessage`, `ctx.previousMessages`, and `ctx.executedActions` into a structured JSON
  - Log `@Display: Thinking...`
  - Add a placeholder for an async LLM call, like this:
    ```js
    const decision = await callLLM(structuredInput);
    ```
  - Simulate returning an object with the structure:
    ```js
    return { action: "saveMemory", data: { /* ... */ } };
    ```
- Make the list of possible `action` values clear: `saveMemory`, `editMemory`, `deleteMemory`, `searchMemory`, `finalize`

---

## Prompt 3 – Finalize Cycle

Create the function `finalizeCycle(ctx, result)`:

- This function ends the current cycle by summarizing all actions taken.
- It should:
  - Use a placeholder for LLM that reads `ctx.executedActions` and generates a brief summary
  - Log the result using `@Display: Summary from LLM`
  - Return the summary string to be shown to the user

---

## Prompt 4 – Save Memory

Create a new function `saveMemory(ctx, data)`:

- This function stores new memory items based on context
- It should:
  - Log `@Display: Preparing memory to save...`
  - Call the LLM to extract short, isolated memory items from `ctx.originalMessage` (or `data.input`)
  - Log the extracted items
  - Add a placeholder for generating embeddings for each memory item
  - For each memory item:
    - Insert into a NoSQL database (use stub or fake object)
    - Save the embedding vector into a vector database (linked by memory ID)
  - Log `@Display: Saving memory...`
  - After saving, call LLM to generate a short summary of the operation
  - Log `@Display: Memory saved!`

---

## Prompt 5 – Edit Memory

Create a function `editMemory(ctx, data)`:

- This function updates existing memory items
- Steps:
  - Log `@Display: Preparing memory to edit...`
  - Use LLM to extract which memory IDs to edit and what their new contents should be
  - Log this list
  - For each item, simulate updating in NoSQL (only, no vector DB changes)
  - Call LLM to summarize what was edited
  - Log `@Display: Memory saved!`

---

## Prompt 6 – Delete Memory

Create a function `deleteMemory(ctx, data)`:

- This function removes memory items from storage
- Steps:
  - Log `@Display: Preparing to delete memory...`
  - Use LLM to determine which memory IDs to delete and why
  - Log the LLM response
  - Simulate deletion from:
    - NoSQL database
    - Vector DB (if applicable)
  - Ensure you consider any relationships (if modeled)
  - Call LLM to summarize deletion
  - Log `@Display: Memory deleted!`

---

## Prompt 7 – Search Memory

Create a function `searchMemory(ctx, data)`:

- This function performs a memory lookup using a context query
- Steps:
  - Log `@Display: Preparing to search memory...`
  - Use LLM to extract search topics or key terms from current context
  - Display these terms
  - Optionally generate embeddings (stub ok)
  - Simulate querying vector DB and retrieving memory items from NoSQL using matched IDs
  - Summarize results with LLM
  - Log `@Display: Memory retrieved!`

---

## Prompt 8 – Add CLI Entry

Modify your main entrypoint file, such as `index.js`:

- Import the `startCycle` function from `thoughtCycle.js`
- Set up a simple CLI or function that prepares the initial context:
  ```js
  const ctx = {
    originalMessage: "Help me summarize my notes",
    previousMessages: ["Hi", "What can I help you with?"],
    executedActions: []
  };
  startCycle(ctx);
  ```
- Run this and print the final output to the console