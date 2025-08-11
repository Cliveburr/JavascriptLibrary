import { ChatContext, ChatEntity } from '../entities';
import { LlmRequestMessage } from '../llm';

export type FilterContextTypes = 'user' | 'reflection_response' | 'memory_search_response' |
    'memory_search_result' | 'reply_response';

function getContentForContext(context: ChatContext): string {
    if (context.type == 'reflection_response' && context.reflectionResponse) {
        return JSON.stringify(context.reflectionResponse);
    }
    else if (context.type == 'memory_search_response' && context.memorySearchResponse) {
        return JSON.stringify(context.memorySearchResponse);
    }
    else if (context.type == 'memory_search_result' && context.memorySearchResult) {
        return '# memory_search_result: ' + JSON.stringify(context.memorySearchResult);
    }
    else if (context.type == 'reply_response' && context.replyResponse) {
        return context.replyResponse.content;
    }
    else {
        throw 'Invalid or missing context for: ' + context.type;
    }
}

export function filterContextForRequest(
    chat: ChatEntity,
    systemPrompt: string,
    types?: FilterContextTypes[]
): LlmRequestMessage[] {

    const history: LlmRequestMessage[] = [];

    for (let iteration of chat.iterations) {
        if (!types || types?.indexOf('user') > -1) {
            history.push({ role: 'user', content: iteration.userMessage });
        }
        for (let request of iteration.requests) {
            for (let context of request.contexts) {
                if (!types || types?.indexOf(context.type) > -1) {
                    history.push({ role: 'assistant', content: getContentForContext(context) });
                }
            }
        }
    }

    return [
        { role: 'system', content: systemPrompt },
        ...history
    ];
}