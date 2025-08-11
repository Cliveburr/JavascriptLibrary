import type { IStreamChatContext } from '../thought/stream-chat';
import type { LlmGateway } from '../llm/llm.gateway';

export interface ActionHandler {
    readonly name: string;
    execute(ctx: IStreamChatContext, llmGateway: LlmGateway): Promise<void>;
}