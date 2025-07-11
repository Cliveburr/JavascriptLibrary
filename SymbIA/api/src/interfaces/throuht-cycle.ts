
/**
 * Context object for the thought cycle
 */
export interface ThoughtCycleContext {
  /**
   * The user's original message
   */
  originalMessage: string;

  /**
   * Array of prior messages in the conversation
   */
  previousMessages: ThoughtCycleMessage[];

  /**
   * Array of actions already performed during this cycle
   */
  executedActions: ActionResult[];
}

export interface ThoughtCycleMessage {
  role: 'user' | 'assistant';
  content: string;
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
  action: string;

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
