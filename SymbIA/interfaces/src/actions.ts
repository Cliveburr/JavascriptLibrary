// Action handlers for the Thought Cycle

export interface ActionContext {
    userId: string;
    memoryId: string;
    chatId: string;
    sendMessage: (message: any) => void;
    llm: any; // LLM gateway instance
    mongo: any; // MongoDB connection
    vector: any; // Qdrant vector database connection
    llmSetId: string; // Required LLM set ID for this request
}

export interface ActionHandler {
    readonly name: string;
    readonly enabled: boolean;
    execute(ctx: ActionContext): Promise<void>;
}
