import { ActionResult, ACTIONS, ActionType, StreamChatProgress, ThoughtCycleContext } from "../../interfaces/thought-cycle";
import { LLMManager } from "../llm.service";
import { 
  FinalizeAction, 
  SaveMemoryAction, 
  // EditMemoryAction, 
  // DeleteMemoryAction, 
  // SearchMemoryAction 
} from '../../actions';

export class ActionService {

    constructor(
        private llmManager: LLMManager
    ) {
    }

    public runAction(action: ActionType, ctx: ThoughtCycleContext, onProgress: (message: StreamChatProgress) => void): Promise<ActionResult> {
        switch (action) {
            case ACTIONS.FINALIZE:
                const finalizeAction = new FinalizeAction(this.llmManager);
                return finalizeAction.execute(ctx, onProgress);
            case ACTIONS.SAVE_MEMORY:
                const saveMemoryAction = new SaveMemoryAction(this.llmManager);
                return saveMemoryAction.execute(ctx, onProgress);
            case ACTIONS.EDIT_MEMORY:
                // Temporarily commented out
                return Promise.resolve({
                    action: ACTIONS.EDIT_MEMORY,
                    result: 'Edit memory action temporarily disabled',
                    timestamp: new Date()
                });
            case ACTIONS.DELETE_MEMORY:
                // Temporarily commented out
                return Promise.resolve({
                    action: ACTIONS.DELETE_MEMORY,
                    result: 'Delete memory action temporarily disabled',
                    timestamp: new Date()
                });
            case ACTIONS.SEARCH_MEMORY:
                // Temporarily commented out
                return Promise.resolve({
                    action: ACTIONS.SEARCH_MEMORY,
                    result: 'Search memory action temporarily disabled',
                    timestamp: new Date()
                });
            default:
                throw `Invalid action "${action}" returned from LLM for decision make`;        }
    }
}