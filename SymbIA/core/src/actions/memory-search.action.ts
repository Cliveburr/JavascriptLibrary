// import type { ActionHandler, IChatContext } from '@symbia/interfaces';

// export class MemorySearchAction implements ActionHandler {
//     readonly name = "MemorySearch";
//     readonly enabled = true;

//     async execute(ctx: IChatContext): Promise<void> {
//         try {
//             // Get the LLM set to use for this request
//             const llmSetId = ctx.llmSetId;
//             if (!llmSetId) {
//                 throw new Error('LLM set ID is required');
//             }

//             const llmSetService = ctx.llm.llmSetService;
//             const llmSet = await llmSetService.getLlmSetById(llmSetId);

//             if (!llmSet) {
//                 throw new Error(`LLM set not found: ${llmSetId}`);
//             }

//             // Step 1: Show progress message
//             ctx.sendMessage({
//                 modal: 0, // MessageProgressModal.Info
//                 data: {
//                     "chat-history": false,
//                     "modal": "text-for-replace",
//                     "content": "Buscando por memorias..."
//                 }
//             });

//             // Step 2: Generate search queries using LLM
//             const reasoningMessages = [
//                 {
//                     role: 'system',
//                     content: 'You are an AI assistant that generates search queries for memory retrieval. Based on the conversation context, generate a JSON array of short, isolated search contexts that represent the information you need to find. Each item should be a specific piece of information or concept.'
//                 },
//                 {
//                     role: 'user',
//                     content: 'Generate search queries for the information I need to find in memory. Respond with only a JSON array of strings, like: ["user information", "password aliexpress site"]'
//                 }
//             ];

//             ctx.sendMessage({
//                 modal: 0, // MessageProgressModal.Info
//                 data: {
//                     "chat-history": false,
//                     "modal": "text-for-replace",
//                     "content": "Buscando por memorias, formatando..."
//                 }
//             });

//             const queriesResponse = await ctx.llm.invoke(llmSet, 'reasoning', reasoningMessages, {
//                 temperature: 0.3,
//                 maxTokens: 200
//             });

//             // Parse the JSON response
//             let searchQueries: string[] = [];
//             try {
//                 searchQueries = JSON.parse(queriesResponse.content);
//                 if (!Array.isArray(searchQueries)) {
//                     throw new Error('Expected array of strings');
//                 }
//             } catch (parseError) {
//                 console.error('Failed to parse search queries:', parseError);
//                 searchQueries = ['user information']; // Fallback
//             }

//             // Step 3: Generate embeddings for each query
//             ctx.sendMessage({
//                 modal: 0, // MessageProgressModal.Info
//                 data: {
//                     "chat-history": false,
//                     "modal": "text-for-replace",
//                     "content": "Buscando por memorias, pesquisando"
//                 }
//             });

//             // TODO: Implement actual vector search when Qdrant integration is ready
//             // For now, simulate finding some memories
//             const foundMemories = searchQueries.map((query, index) => ({
//                 id: `memory-${index}`,
//                 content: `Simulated memory for query: ${query}`,
//                 type: 'text',
//                 keyWords: query
//             }));

//             // Step 4: Send each found memory as a separate message
//             for (const memory of foundMemories) {
//                 ctx.sendMessage({
//                     modal: 1, // MessageProgressModal.Text
//                     data: {
//                         "chat-history": true,
//                         "modal": "memory",
//                         "content": memory
//                     }
//                 });
//             }

//             // Step 5: Send explanation of what was found
//             const explanationMessages = [
//                 {
//                     role: 'system',
//                     content: 'You are a helpful AI assistant. Briefly explain what memories were found and how they relate to the user\'s request.'
//                 },
//                 {
//                     role: 'user',
//                     content: `I found ${foundMemories.length} memories related to: ${searchQueries.join(', ')}. Provide a brief explanation of what was found.`
//                 }
//             ];

//             const explanationResponse = await ctx.llm.invoke(llmSet, 'chat', explanationMessages, {
//                 temperature: 0.7,
//                 maxTokens: 150
//             });

//             ctx.sendMessage({
//                 modal: 1, // MessageProgressModal.Text
//                 data: {
//                     "chat-history": true,
//                     "modal": "text",
//                     "role": "assistant",
//                     "content": explanationResponse.content || `Found ${foundMemories.length} relevant memories.`
//                 }
//             });

//         } catch (error) {
//             console.error('Error in MemorySearchAction:', error);
//             throw new Error(`Failed to execute MemorySearch action: ${error instanceof Error ? error.message : 'Unknown error'}`);
//         }
//     }
// }

// // Export instance for registry
// export const memorySearchAction = new MemorySearchAction();
