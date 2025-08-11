import type { ThoughtContext } from '../thought';
import type { LlmGateway } from '../llm';

export interface ActionHandler {
    readonly name: string;
    execute(thoughtCtx: ThoughtContext, llmGateway: LlmGateway): Promise<void>;
}