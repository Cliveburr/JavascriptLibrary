import { FinalizeAction } from './finalize.action';
import { SaveMemoryAction } from './save-memory.action';
import { EditMemoryAction } from './edit-memory.action';
import { DeleteMemoryAction } from './delete-memory.action';
import { SearchMemoryAction } from './search-memory.action';

export {
  FinalizeAction,
  SaveMemoryAction,
  EditMemoryAction,
  DeleteMemoryAction,
  SearchMemoryAction
};

export const ACTIONS = {
  SAVE_MEMORY: 'saveMemory',
  EDIT_MEMORY: 'editMemory',
  DELETE_MEMORY: 'deleteMemory',
  SEARCH_MEMORY: 'searchMemory',
  FINALIZE: 'finalize'
} as const;

export type ActionType = typeof ACTIONS[keyof typeof ACTIONS];
