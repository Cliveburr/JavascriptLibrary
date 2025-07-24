import { ThoughtCycleContext } from "@/interfaces/throuht-cycle";
import { Message } from "ollama";

const decisionSystemPrompt = `Voce é um assistente de IA que precisa decidir qual a proxima ação a executar de modo a responder a mensagem do usuário.

Available Actions:
- searchMemory: Responda 'searchMemory' se voce sentir falta de alguma informação para tomar a decisão de modo seguro, lembre-se de não supor que tem conhece as coisas
- saveMemory: Responda 'saveMemory' se decida gravar alguma informação apenas se estiver claro que usuário assim deseja na mensagem original
- editMemory: Responda 'editMemory' se decida editar alguma memoria apenas se nas memórias abaixo conter alguma informação que usuário esteja passando diferente na mensagem original 
- deleteMemory: Responda 'deleteMemory' se decida deletar alguma memoria apenas se voce tiver certeza abosulta que o usuário assim deseja na mensagem original
- finalize: Responda com 'finalize' para finalizar esse ciclo se você achar que já tem informação suficiente ou se já executou tudo oque foi pedido na mensagem original, ou ainda se ficar em indeciso sobre oque fazer

Based on the context, decide the next action.
Your response should be just one single word of the action name.`;

export function buildFinalizeMessages(ctx: ThoughtCycleContext): Message[] {
    
    const acionsExecuted = ctx.executedActions
        .map(a => ({
            role: 'assistant',
            content: a.result
        }));

    return [
        {
            role: 'system',
            content: decisionSystemPrompt
        },
        ...ctx.previousMessages,
        ...acionsExecuted,
        {
            role: 'user',
            content: ctx.originalMessage
        }
    ];
} 