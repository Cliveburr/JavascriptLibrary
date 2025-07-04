# VSCode Copilot Prompts – SymbIA Thought Chain Upgrade (Detailed)

---

## Prompt 1 – Create Cycle Core

Read the file PLANNING.md to know the full changes and do the first part bellow
Read the backend in api/ folder and the client ui in web/ folder to follow the same patterns

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

Read the file PLANNING.md to know the full changes and do the first part bellow
Read the backend in api/ folder and the client ui in web/ folder to follow the same patterns

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

Create the function `finalizeCycle(ctx, result) in thought-cycle.service.ts`:

Read the file PLANNING.md to know the full changes and do the first part bellow
Read the backend in api/ folder and the client ui in web/ folder to follow the same patterns

- This function ends the current cycle by summarizing all actions taken.
- It should:
  - Use a placeholder for LLM that reads `ctx.executedActions` and generates a brief summary
  - Log the result using `@Display: Summary from LLM`
  - Return the summary string to be shown to the user

---

## Prompt 4 – Save Memory

Read the file PLANNING.md to know the full changes and do the first part bellow
Read the backend in api/ folder and the client ui in web/ folder to follow the same patterns

Create a new function `saveMemory(ctx, data) in thought-cycle.service.ts`:

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

Read the file PLANNING.md to know the full changes and do the first part bellow
Read the backend in api/ folder and the client ui in web/ folder to follow the same patterns

Create a function `editMemory(ctx, data) in thought-cycle.service.ts`:

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

Read the file PLANNING.md to know the full changes and do the first part bellow
Read the backend in api/ folder and the client ui in web/ folder to follow the same patterns

Create a function `deleteMemory(ctx, data) in thought-cycle.service.ts`:

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

Read the file PLANNING.md to know the full changes and do the first part bellow
Read the backend in api/ folder and the client ui in web/ folder to follow the same patterns

Create a function `searchMemory(ctx, data) in thought-cycle.service.ts`:

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

Read the file PLANNING.md to know the full changes and do the first part bellow
Read the backend in api/ folder and the client ui in web/ folder to follow the same patterns

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

Na parte web apenas, adapte a tela Dashboard.jsx para a seguinte estrutura

leia o arquivo BULMA_INFO.md para saber como usar o bulma css

A tela será usada para ser o ponto principal do projeto, onde o usuário irá conversar com a IA, visualizar os diversos modais de resultados, escrever pergunta, começar novos chats, criar um novo banco de memoria

- Barra latera de 245px
  Na primeira linha do lado esquerdo um botão da mesma cor de fundo da barra lateral com o logo 36x36px e o texto "SymbIA"
  Na segunda linha, um botão seguindo a memsa cor de fundo da barra lateral com um icone em 24x24px que no futuro vai ser a imagem do usuário, mas por enquanto apenas um icone e depois o nome do usuario, o botão no futuro vai para pagina de configurações,
  Em baixo vai ter uma lista de opções com o titulo "Memories", do lado direito do titulo porém alinhado a direita um botão somente com icone de adicionar, e em seguida vai ter as opções que depois vamos criar
  Em baixo outra lista no mesmo padrão da de cima com o titulo "Chats", do lado direito do titulo porém alinhado a direita um botão somente com icone de adicionar, e em seguida vai ter as chats q foram criados
- Do lado direito da barra lateral
  Na parte de cima todinha, com padding de pequeno tomando toda a area, vai ser a area de historico da conversa dos diversos modais resultado da conversa, e na parte inferior, um box para o usuário entrar a pergunta e apenas um botão enviar que vai mudar para pausar quando estiver sendo processada a pergunta

---

Na tela Dashboard.jsx tem o botão para adicionar memorias, vamos implementar isso agora

Funcionamento geral das memorias, é um registro no banco mongodb para o usuário com o um nome para identificar essa memoria, mais o nome de um banco qdrant que será usado somente para essa memoria, o nome desse banco vai ser gerado misturando o username do usuário mais o id dessa memoria e é invisivel para o usuário, só fica no backend

Na parte visual, a cada memoria é um item do menu com um botão de deletar do lado direito, crie um modal reutilizavel para perguntar se confirma excluir a memoria
Uma memoria sempre deve estár selecionada
A tela dashboard deve carregar a lista de memorias e lembrar qual memoria o usuário estava selecionada para sempre ter uma memoria selecionada

Ao criar um novo usuário, crie já uma nova memoria padrão para esse usuário

Apenas crie toda essa estrutura para criar novas memorias e deletar memorias o uso real será implementadao mais tarde

leia o arquivo BULMA_INFO.md para saber como usar o bulma css

---

Vamos implementar primeiramente uma chat basico com a IA da tela Dashboard.jsx

Ao usuário enviar uma questão, primeira passo é verificar se é uma conversa nova,
se for conversa nova, adicione um novo item na lista do lado do Dashboard.jsx com o texto temporario "New chat..." e então efetuar a chamada ao LLM fazendo stream do retorno, ao final chame novamente o LLM pedindo ele para criar um titulo de no maximo 100 letras para essa nova conversa, então crie um novo model Chat com esse titulo, que tenha a pergunta do usuário e o retorno do LLM e salve no mongodb, por fim retorne o titulo gerado para atualizar o texto temporario
se for uma conversa já selecionada, chame o LLM passando as mensagens passadas do usuário como role 'user' e as respostas anteriores do LLM como 'assistant', faça stream desse retorno e no final atualize o registro no mongodb

Na parte visual, a cada chat é um item do menu com botão de deletar do lado direito, pode fazer igual o da "memories"

basea-se no endpoint '/api/chat/stream' para já saber como fazer o stream da chamada LLM

leia o arquivo BULMA_INFO.md para saber como usar o bulma css