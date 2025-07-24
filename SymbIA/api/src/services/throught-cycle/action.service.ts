import { ActionResult, ACTIONS, ActionType, StreamChatProgress, ThoughtCycleContext } from "@/interfaces/throuht-cycle";
import { LLMManager } from "../llm.service";
import { 
  FinalizeAction, 
  SaveMemoryAction, 
  EditMemoryAction, 
  DeleteMemoryAction, 
  SearchMemoryAction 
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
                const editMemoryAction = new EditMemoryAction(this.llmManager);
                return editMemoryAction.execute(ctx, onProgress);
            case ACTIONS.DELETE_MEMORY:
                const deleteMemoryAction = new DeleteMemoryAction(this.llmManager);
                return deleteMemoryAction.execute(ctx, onProgress);
            case ACTIONS.SEARCH_MEMORY:
                const searchMemoryAction = new SearchMemoryAction(this.llmManager);
                return searchMemoryAction.execute(ctx, onProgress);
            default:
                throw `Invalid action "${action}" returned from LLM for decision make`;        }
    }
}