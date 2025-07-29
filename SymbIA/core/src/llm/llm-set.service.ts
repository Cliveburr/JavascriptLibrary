import { readdir, readFile } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { injectable } from 'tsyringe';
import type { LlmSetConfig, ModelSpec } from '@symbia/interfaces';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@injectable()
export class LlmSetService {
    private cachedSets: LlmSetConfig[] | null = null;
    private llmSetsPath: string;

    constructor() {
        // Try different possible paths for the llmsets directory
        const possiblePaths = [
            // When running from built/transpiled code
            resolve(__dirname, '../../../api/src/llmsets'),
            // When running from source during development
            resolve(__dirname, '../../../../api/src/llmsets'),
            // Fallback relative path
            resolve(process.cwd(), 'api/src/llmsets'),
        ];

        // Use the first path that exists, or default to the first one
        this.llmSetsPath = possiblePaths[0] || resolve(process.cwd(), 'api/src/llmsets');
    }

    /**
     * Load all LLM sets from the llmsets directory
     */
    async loadLlmSets(): Promise<LlmSetConfig[]> {
        if (this.cachedSets) {
            return this.cachedSets;
        }

        try {
            const files = await readdir(this.llmSetsPath);
            const jsonFiles = files.filter(file => file.endsWith('.json'));

            const sets: LlmSetConfig[] = [];

            for (const file of jsonFiles) {
                try {
                    const filePath = join(this.llmSetsPath, file);
                    const content = await readFile(filePath, 'utf-8');
                    const setConfig = JSON.parse(content) as LlmSetConfig;

                    // Validate required fields
                    if (setConfig.id && setConfig.display && setConfig.models) {
                        // Apply default index 999
                        setConfig.index = setConfig.index ?? 999;

                        sets.push(setConfig);
                    } else {
                        console.warn(`Invalid LLM set configuration in file: ${file}`);
                    }
                } catch (error) {
                    console.error(`Error loading LLM set from file ${file}:`, error);
                }
            }

            // Sort sets by display name
            console.log(`Loaded ${sets.length} LLM sets!`);

            this.cachedSets = sets.sort((a, b) => {
                const aIndex = typeof a.index === 'number' ? a.index : 999;
                const bIndex = typeof b.index === 'number' ? b.index : 999;
                const aIsNumber = aIndex !== 999;
                const bIsNumber = bIndex !== 999;

                if (aIsNumber && bIsNumber) {
                    return aIndex - bIndex;
                }
                if (aIsNumber && !bIsNumber) {
                    return -1;
                }
                if (!aIsNumber && bIsNumber) {
                    return 1;
                }
                // Ambos não são número (index == 999)
                return a.display.localeCompare(b.display);
            });
            return this.cachedSets;
        } catch (error) {
            console.error('Error loading LLM sets:', error);
            return [];
        }
    }

    /**
     * Get a specific LLM set by ID
     */
    async getLlmSetById(id: string): Promise<LlmSetConfig | null> {
        const sets = await this.loadLlmSets();
        return sets.find(set => set.id === id) || null;
    }

    /**
     * Clear the cache to force reload on next access
     */
    clearCache(): void {
        this.cachedSets = null;
    }

    /**
     * Get available providers from all LLM sets
     */
    async getAvailableProviders(): Promise<string[]> {
        const sets = await this.loadLlmSets();
        const providers = new Set<string>();

        sets.forEach(set => {
            Object.values(set.models).forEach(model => {
                if (model?.provider) {
                    providers.add(model.provider);
                }
            });
        });

        return Array.from(providers).sort();
    }

    /**
     * Get model specification for a specific purpose from a LLM set
     */
    getModelSpec(llmSetConfig: LlmSetConfig, purpose: 'reasoning' | 'reasoningHeavy' | 'chat' | 'codegen' | 'embedding'): ModelSpec | null {
        const model = llmSetConfig.models[purpose];
        if (!model) {
            return null;
        }

        return {
            provider: model.provider,
            model: model.model
        };
    }

    /**
     * Get model specification with fallback logic
     */
    getModelSpecWithFallback(llmSetConfig: LlmSetConfig, purpose: 'reasoning' | 'reasoningHeavy' | 'chat' | 'codegen' | 'embedding'): ModelSpec | null {
        // Try the specific purpose first
        let model = llmSetConfig.models[purpose];

        // Fallback logic based on purpose
        if (!model) {
            switch (purpose) {
                case 'reasoningHeavy':
                    model = llmSetConfig.models.reasoning || llmSetConfig.models.chat;
                    break;
                case 'reasoning':
                    model = llmSetConfig.models.chat || llmSetConfig.models.reasoningHeavy;
                    break;
                case 'chat':
                    model = llmSetConfig.models.reasoning || llmSetConfig.models.reasoningHeavy;
                    break;
                case 'codegen':
                    model = llmSetConfig.models.reasoning || llmSetConfig.models.chat;
                    break;
                case 'embedding':
                    // Embedding usually doesn't have a fallback, but could fallback to a small model
                    model = llmSetConfig.models.chat;
                    break;
            }
        }

        if (!model) {
            return null;
        }

        return {
            provider: model.provider,
            model: model.model
        };
    }
}
