// Re-export the LLM types from the shared interfaces package
export type {
    LlmSetConfig,
    LlmSetIcon,
    LlmSetModel,
    LlmSetListResponse
} from '@symbia/interfaces';

// Additional types specific to the web app
export interface LlmSetOption {
    id: string;
    display: string;
    info?: string;
    icon: {
        type: 'path' | 'svg' | 'emoji';
        d?: string;
        fill?: string;
        svg?: string;
        emoji?: string;
        viewBox?: string;
    };
    provider: string; // Primary provider (extracted from models)
    modelCount: number; // Number of models in the set
}
