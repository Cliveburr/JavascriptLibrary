import { ServiceRegistry } from './services/service-registry.js';
import { MemoryService } from './memory/memory.service.js';
import { EmbeddingService } from './memory/embedding.service.js';
import { QdrantProvider } from './memory/qdrant.provider.js';
import { LlmGateway } from './llm/LlmGateway.js';
import { LlmSetService } from './llm/llm-set.service.js';
import { OpenAIProvider } from './llm/providers/openai.js';
import { OllamaProvider } from './llm/providers/ollama.js';
import { DecisionService } from './thought/decision.service.js';
import { ActionService } from './actions/action.service.js';
import { ThoughtCycleService } from './thought/thought-cycle.service.js';
import { AuthService } from './auth/auth.service.js';
import { MongoDBService } from './database/mongodb.service.js';
import { ChatService } from './chat/chat.service.js';
import { ConfigService } from './config/config.service.js';

// Export services
export * from './llm/LlmGateway.js';
export * from './llm/llm-set.service.js';
export * from './llm/providers/openai.js';
export * from './llm/providers/ollama.js';
export * from './memory/memory.service.js';
export * from './memory/embedding.service.js';
export * from './memory/qdrant.provider.js';
export * from './thought/decision.service.js';
export * from './actions/action.service.js';
export * from './thought/thought-cycle.service.js';
export * from './auth/auth.service.js';
export * from './database/mongodb.service.js';
export * from './chat/chat.service.js';
export * from './config/config.service.js';
export * from './services/service-registry.js';

// Export types
export * from './types/index.js';

// Configure services registry
export function configureContainer() {
    const registry = ServiceRegistry.getInstance();

    // Create services instances in the correct order (respecting dependencies)
    const configService = new ConfigService();
    const mongodbService = new MongoDBService(configService);
    const qdrantProvider = new QdrantProvider(configService);
    const llmSetService = new LlmSetService();
    const openaiProvider = new OpenAIProvider(configService);
    const ollamaProvider = new OllamaProvider(configService);
    const llmGateway = new LlmGateway(openaiProvider, ollamaProvider);
    const embeddingService = new EmbeddingService(llmGateway, llmSetService);
    const memoryService = new MemoryService(mongodbService);
    const chatService = new ChatService(mongodbService, llmGateway, llmSetService);
    const actionService = new ActionService(llmGateway);
    const decisionService = new DecisionService(actionService, llmGateway);
    const thoughtCycleService = new ThoughtCycleService(actionService, decisionService);
    const authService = new AuthService(mongodbService, configService);

    // Register all services
    registry.register('ConfigService', configService);
    registry.register('MongoDBService', mongodbService);
    registry.register('MemoryService', memoryService);
    registry.register('EmbeddingService', embeddingService);
    registry.register('QdrantProvider', qdrantProvider);
    registry.register('LlmSetService', llmSetService);
    registry.register('OpenAIProvider', openaiProvider);
    registry.register('OllamaProvider', ollamaProvider);
    registry.register('LlmGateway', llmGateway);
    registry.register('DecisionService', decisionService);
    registry.register('ActionService', actionService);
    registry.register('ThoughtCycleService', thoughtCycleService);
    registry.register('AuthService', authService);
    registry.register('ChatService', chatService);

    return registry;
}