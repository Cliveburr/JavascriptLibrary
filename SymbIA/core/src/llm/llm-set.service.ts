import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import type { LlmSetConfig } from './llm.types';

export class LlmSetService {
    private cachedSets: LlmSetConfig[] | null = null;
    private llmSetsPath: string;

    constructor() {
        const cwd = process.cwd();
        console.log('Current working directory:', cwd);

        if (cwd.endsWith('api') || cwd.includes('\\api\\')) {
            this.llmSetsPath = resolve(cwd, 'src/llmsets');
        } else {
            this.llmSetsPath = resolve(cwd, 'api/src/llmsets');
        }

        console.log('LLM sets path:', this.llmSetsPath);
    }

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

                    if (setConfig.id && setConfig.display && setConfig.models &&
                        setConfig.models.reasoning && setConfig.models.reasoningHeavy &&
                        setConfig.models.fastChat && setConfig.models.codegen && setConfig.models.embedding) {
                        setConfig.index = setConfig.index ?? 999;

                        sets.push(setConfig);
                    } else {
                        console.warn(`Invalid LLM set configuration in file: ${file}`);
                    }
                } catch (error) {
                    console.error(`Error loading LLM set from file ${file}:`, error);
                }
            }

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
                return a.display.localeCompare(b.display);
            });
            return this.cachedSets;
        } catch (error) {
            console.error('Error loading LLM sets:', error);
            return [];
        }
    }

    async getLlmSetById(id: string): Promise<LlmSetConfig | null> {
        const sets = await this.loadLlmSets();
        return sets.find(set => set.id === id) || null;
    }

    clearCache(): void {
        this.cachedSets = null;
    }

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
}
