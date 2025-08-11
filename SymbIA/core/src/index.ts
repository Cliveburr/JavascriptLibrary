import { QdrantProvider } from './vector';
import { LlmSetService, LlmGateway, OllamaProvider, OpenAIProvider } from './llm';
import { ReflectionService, ThoughtCycleService } from './thought';
import { ActionService } from './actions';
import { MongoDBService } from './database/mongodb.service';
import { ServiceRegistry, ChatService, AuthService, ConfigService, MemoryService, PromptService, PromptForUseService } from './services';

// Export services
export * from './actions';
export * from './thought';
export * from './database/mongodb.service';
export * from './services';
export * from './llm';
export * from './services';
export * from './vector';

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
    const memoryService = new MemoryService(mongodbService);
    const chatService = new ChatService(mongodbService);
    const actionService = new ActionService(llmGateway);
    const reflectionService = new ReflectionService(llmGateway);
    const thoughtCycleService = new ThoughtCycleService(actionService, reflectionService);
    const authService = new AuthService(mongodbService, configService);
    const promptService = new PromptService(mongodbService);
    const promptForUseService = new PromptForUseService(promptService);

    // Register all services
    registry.register('ConfigService', configService);
    registry.register('MongoDBService', mongodbService);
    registry.register('MemoryService', memoryService);
    registry.register('QdrantProvider', qdrantProvider);
    registry.register('LlmSetService', llmSetService);
    registry.register('OpenAIProvider', openaiProvider);
    registry.register('OllamaProvider', ollamaProvider);
    registry.register('LlmGateway', llmGateway);
    registry.register('ReflectionService', reflectionService);
    registry.register('ActionService', actionService);
    registry.register('ThoughtCycleService', thoughtCycleService);
    registry.register('AuthService', authService);
    registry.register('ChatService', chatService);
    registry.register('PromptService', promptService);
    registry.register('PromptForUseService', promptForUseService);

    return registry;
}