import { IChat, IMessage } from "@/models/chat.model";

export const ACTIONS = {
  SAVE_MEMORY: 'saveMemory',
  EDIT_MEMORY: 'editMemory',
  DELETE_MEMORY: 'deleteMemory',
  SEARCH_MEMORY: 'searchMemory',
  FINALIZE: 'finalize'
} as const;

export type ActionType = typeof ACTIONS[keyof typeof ACTIONS];

export enum StreamChatProgressType {
  Done = 0,
  Error = 1,
  RequestTitle = 2,
  Info = 3,
  TextStream = 4
}

export interface StreamChatProgress {
  type: StreamChatProgressType;
  data?: string;
}

/**
 * Context object for the thought cycle
 */
export interface ThoughtCycleContext {
  /**
   * The chat for this message
   */
  chat: IChat;

  /**
   * The user's original message
   */
  message: string;

  /**
   * Array of prior messages in the conversation
   */
  messages: IMessage[];

  /**
   * Array of actions already performed during this cycle
   */
  executedActions: ActionResult[];
}

/**
 * Action decision returned by the LLM
 */
export interface ActionDecision {
  /**
   * The action to be performed
   */
  action: string;

  /**
   * Additional data for the action
   */
  data?: any;
}

/**
 * Result of an executed action
 */
export interface ActionResult {
  /**
   * The action that was performed
   */
  action: ActionType;

  /**
   * The result or output of the action
   */
  result: string;

  /**
   * Timestamp when the action was executed
   */
  timestamp: Date;

  /**
   * Additional data associated with the action
   */
  data?: any;
}
