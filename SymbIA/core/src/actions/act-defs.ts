import type { IChatContext } from '@symbia/interfaces';
import type { LlmGateway } from '../llm/LlmGateway';

export interface ActionHandler {
    readonly name: string;
    readonly whenToUse: string;
    readonly enabled: boolean;
    execute(ctx: IChatContext, llmGateway: LlmGateway): Promise<void>;
}