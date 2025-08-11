import type { ThoughtContext } from '../thought';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm';

import { replyAction } from './reply/reply.action';
import { memorySearchAction } from './memory-search/memory-search.action';

export class ActionService {

    private allActions: ActionHandler[] = [
        replyAction,
        memorySearchAction,
    ];

    constructor(
        private llmGateway: LlmGateway
    ) { }

    getActionByName(name: string): ActionHandler | undefined {
        return this.allActions.find(action => action.name === name);
    }

    async executeAction(actionName: string, thoughtCtx: ThoughtContext): Promise<void> {
        const actionHandler = this.getActionByName(actionName);

        if (!actionHandler) {
            throw new Error(`Action '${actionName}' not found`);
        }

        await actionHandler.execute(thoughtCtx, this.llmGateway);
    }
}
