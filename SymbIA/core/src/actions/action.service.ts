import type { IStreamChatContext } from '../thought/stream-chat';
import type { ActionHandler } from './act-defs';
import { LlmGateway } from '../llm';

import { replyAction } from './reply.action';
import { memorySearchAction } from './memory-search.action';

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

    async executeAction(actionName: string, ctx: IStreamChatContext): Promise<void> {
        const actionHandler = this.getActionByName(actionName);

        if (!actionHandler) {
            throw new Error(`Action '${actionName}' not found`);
        }

        await actionHandler.execute(ctx, this.llmGateway);
    }
}
