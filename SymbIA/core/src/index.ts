import 'reflect-metadata';
import { container } from 'tsyringe';
import { MemoryService } from './memory/memory.service.js';
import { LlmSelectorService } from './llm/selector.js';
import { PlannerService } from './planner/planner.service.js';
import { ActionService } from './actions/action.service.js';

// Export services
export * from './llm/selector.js';
export * from './memory/memory.service.js';
export * from './planner/planner.service.js';
export * from './actions/action.service.js';

// Export container for external usage
export { container };

// Configure DI container
export function configureContainer() {
    // Register services as singletons
    container.registerSingleton(MemoryService);
    container.registerSingleton(LlmSelectorService);
    container.registerSingleton(PlannerService);
    container.registerSingleton(ActionService);

    return container;
}
