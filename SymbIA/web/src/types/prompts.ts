export interface PromptEntry {
    name: string;
    systemPrompt: string;
    contextConvert: string;
    temperature?: number;
    maxTokens?: number;
}

export interface PromptSetDTO {
    _id: string;
    alias: string;
    observation: string;
    manualVersion: number;
    tuningVersion: number;
    isForTunning: boolean;
    prompts: PromptEntry[];
    fromTunningId?: string;
    promptTestResultIds: string[];
}

export interface PromptSetSummaryDTO {
    _id: string;
    alias: string;
    observation: string;
    manualVersion: number;
    tuningVersion: number;
    isForTunning: boolean;
    promptsCount: number;
    testsCount: number;
    totalRequests: number;
    totalSuccess: number;
    allPassed: boolean;
    isCurrent: boolean;
}
