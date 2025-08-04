import type { IChatContext } from '../types/chat-types.js';
import type { ActionHandler } from './act-defs';

// Import all action handlers
import { finalizeAction } from './finalize.action';
import type { LlmGateway } from '../llm/LlmGateway';
// import { questionAction } from './question.action.js';
// import { memorySearchAction } from './memory-search.action.js';

export class ActionService {

    private allActions: ActionHandler[] = [
        finalizeAction,
        //questionAction,
        //memorySearchAction,
        // Add new actions here as they are created
    ];

    constructor(
        private llmGateway: LlmGateway
    ) { }

    /**
     * Get only enabled actions
     */
    getActions(): ActionHandler[] {
        return this.allActions.filter(action => action.enabled);
    }

    /**
     * Get action handler by name (searches in all actions, not just enabled)
     */
    getActionByName(name: string): ActionHandler | undefined {
        return this.allActions.find(action => action.name === name);
    }

    /**
     * Register a new action dynamically (for testing or plugins)
     */
    registerAction(action: ActionHandler): void {
        const existingIndex = this.allActions.findIndex(a => a.name === action.name);
        if (existingIndex >= 0) {
            this.allActions[existingIndex] = action;
        } else {
            this.allActions.push(action);
        }
    }

    /**
     * Clear all actions (for testing)
     */
    clearActions(): void {
        this.allActions = [];
    }

    /**
     * Reset to default actions (for testing)
     */
    resetToDefaultActions(): void {
        this.allActions = [finalizeAction /*, questionAction, memorySearchAction */];
    }

    async executeAction(actionName: string, ctx: IChatContext): Promise<void> {
        const actionHandler = this.getActionByName(actionName);

        if (!actionHandler) {
            throw new Error(`Action '${actionName}' not found`);
        }

        if (!actionHandler.enabled) {
            throw new Error(`Action '${actionName}' is disabled`);
        }

        // Executa a ação
        await actionHandler.execute(ctx, this.llmGateway);
    }
}
