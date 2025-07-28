import 'reflect-metadata';
import { container } from 'tsyringe';
import { MemoryService } from './memory/memory.service.js';
import { EmbeddingService } from './memory/embedding.service.js';
import { QdrantProvider } from './memory/qdrant.provider.js';
import { LlmSelectorService } from './llm/selector.js';
import { LlmGateway } from './llm/LlmGateway.js';
import { OpenAIProvider } from './llm/providers/openai.js';
import { OllamaProvider } from './llm/providers/ollama.js';
import { PlannerService } from './planner/planner.service.js';
import { ActionService } from './actions/action.service.js';
import { ThoughtCycleService } from './thought/thought-cycle.service.js';

// Export services
export * from './llm/selector.js';
export * from './llm/LlmGateway.js';
export * from './llm/providers/openai.js';
export * from './llm/providers/ollama.js';
export * from './memory/memory.service.js';
export * from './memory/embedding.service.js';
export * from './memory/qdrant.provider.js';
export * from './planner/planner.service.js';
export * from './actions/action.service.js';
export * from './thought/thought-cycle.service.js';

// Export container for external usage
export { container };

// Configure DI container
export function configureContainer() {
    // Register services as singletons
    container.registerSingleton(MemoryService);
    container.registerSingleton(EmbeddingService);
    container.registerSingleton(QdrantProvider);
    container.registerSingleton(LlmSelectorService);
    container.registerSingleton(OpenAIProvider);
    container.registerSingleton(OllamaProvider);
    container.registerSingleton(LlmGateway);
    container.registerSingleton(PlannerService);
    container.registerSingleton(ActionService);
    container.registerSingleton(ThoughtCycleService);

    return container;
}
