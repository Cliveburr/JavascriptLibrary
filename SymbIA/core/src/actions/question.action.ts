// import type { ActionHandler, IChatContext } from '@symbia/interfaces';

// export class QuestionAction implements ActionHandler {
//     readonly name = "Question";
//     readonly enabled = true;

//     async execute(ctx: IChatContext): Promise<void> {
//         try {
//             // Get the LLM set to use for this request
//             const llmSetId = ctx.llmSetId;
//             if (!llmSetId) {
//                 throw new Error('LLM set ID is required');
//             }

//             const llmSetService = ctx.llm.llmSetService; // Access LlmSetService through gateway
//             const llmSet = await llmSetService.getLlmSetById(llmSetId);

//             if (!llmSet) {
//                 throw new Error(`LLM set not found: ${llmSetId}`);
//             }

//             // Build messages for LLM context to generate a question
//             const messages = [
//                 {
//                     role: 'system',
//                     content: 'You are a helpful AI assistant. Based on the conversation context, ask a clarifying question to get more information from the user. Keep your question concise and specific.'
//                 },
//                 {
//                     role: 'user',
//                     content: `Based on the conversation, what question should I ask the user to get the information I need to help them better?`
//                 }
//             ];

//             const response = await ctx.llm.invoke(llmSet, 'chat', messages, {
//                 temperature: 0.7,
//                 maxTokens: 150
//             });

//             // Send the question message (this will be part of chat history)
//             ctx.sendMessage({
//                 modal: 1, // MessageProgressModal.Text
//                 data: {
//                     "chat-history": true,
//                     "modal": "text",
//                     "role": "assistant",
//                     "content": response.content || "Could you provide more details about what you're looking for?"
//                 }
//             });

//         } catch (error) {
//             console.error('Error in QuestionAction:', error);
//             throw new Error(`Failed to execute Question action: ${error instanceof Error ? error.message : 'Unknown error'}`);
//         }
//     }
// }

// // Export instance for registry
// export const questionAction = new QuestionAction();
