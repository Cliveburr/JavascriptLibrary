import type { LlmSet, ModelSpec } from '@symbia/interfaces';

const MODEL_MAP: Record<LlmSet, ModelSpec> = {
  'fast-chat': { provider: 'ollama', model: 'phi3' },
  reasoning: { provider: 'openai', model: 'gpt-4o' },
  embedding: { provider: 'ollama', model: 'nomic-embed-text' },
};

export function pickModel(set: LlmSet): ModelSpec {
  return MODEL_MAP[set];
}
