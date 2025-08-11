import type { ObjectId } from 'mongodb';

export interface PromptConfiguration {
    _id: ObjectId;
    actualPromptSetId: ObjectId;   // Id do set de prompts que vai ser utilizada normalmente pelo sistema
}

export interface PromptSet {
    _id: ObjectId;
    alias: string;
    observation: string;
    manualVersion: number;
    tuningVersion: number;
    isForTunning: boolean;
    prompts: Array<{
        name: string;
        systemPrompt: string;        // Ajustavel pelo sistema de auto-tuning
        contextConvert: string;      // Ajustavel pelo sistema de auto-tuning
        temperature?: number;        // Ajustavel pelo sistema de auto-tuning
        maxTokens?: number;          // Ajustavel pelo sistema de auto-tuning
    }>;
    fromTunningId?: ObjectId;          // Se for gerado automaticamente por tuning
    promptTestResultIds: PromptTestResult[];
}

export interface PromptTest {
    _id: ObjectId;
    iterations: Array<{             // Sequencia de user message e prompts que o sistema deve executar
        userMessage: string;
        requests: Array<{
            name: string;
            responstTest: string;   // Uma função que vai validar o JSON da resposta do LLM e deve retornar null se passou ou um texto explicando oque falhou
        }>;
    }>;
}

export interface PromptTestSet {
    _id: ObjectId;
    alias: string;
    promptTests: PromptTest[];
}

export interface PromptTestResult {
    _id: ObjectId;
    promptSetId: ObjectId;
    promptTestId: ObjectId;
    iterations: Array<{
        userMessage: string;
        requests: Array<{
            name: string;
            provider: string;
            model: string;
            systemPrompt: string;
            responseTest: string;
            llmResponse?: string;
            isSuccess: boolean;
            failExplanation?: string;
            context?: string;
            temperature?: number;
            maxTokens?: number;
        }>;
    }>;
}

export interface PromptTuning {
    _id: ObjectId;
    goal: string;                           // Texto não utilizado só para dar uma explicando do tunning
    targetPromptsSetId: ObjectId;           // O PromptsSet que vai ser afetado
    tunningPromptsSetId: ObjectId;          // O PromptsSet do tipo 'isForTunning' para rodar o tunning
    targetPromptTestResultId?: ObjectId;    // Opcional um PromptTestResult geralmente para correção dos erros
    fixPromptTestId?: ObjectId;             // Opcional um PromptTest se for para rodar o teste em seguida
    resultPromptTestResultId?: ObjectId;    // O resultado dos testes opcional
    rounds?: number;                        // Opcional quantidade para rodar
}