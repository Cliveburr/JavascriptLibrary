import { ThoughtCycleContext, ACTIONS, ActionType } from "../../interfaces/thought-cycle";
import { LLMManager } from "../llm.service";

export class DecisionService {

    constructor(
        private llmManager: LLMManager
    ) {
    }

    /**
     * Uses LLM to decide the next action based on current context
     * @param ctx The current context
     * @returns Promise that resolves to an action decision
     */
    public async decideNextAction(ctx: ThoughtCycleContext): Promise<ActionType> {

        const provider = await this.llmManager.getAvailableProvider();
        if (!provider) {
            throw 'No LLM provider available';
        }

        const action = await provider.decideNextAction(ctx);

        // Ensure action is valid
        if (!this.isActionType(action)) {
            throw `Invalid action "${action}" returned from LLM for decision make`;
        }

        return action;
    }

    private isActionType(value: string): value is ActionType {
        return Object.values(ACTIONS).includes(value as ActionType);
    }
}