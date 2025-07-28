import { describe, it, expect, beforeEach } from 'vitest';
import { container, configureContainer, MemoryService, LlmSelectorService, PlannerService, ActionService } from '../src/index.js';

describe('Dependency Injection Container', () => {
    beforeEach(() => {
        // Clear and reconfigure container before each test
        container.clearInstances();
        configureContainer();
    });

    it('should configure container without errors', () => {
        expect(() => configureContainer()).not.toThrow();
    });

    it('should resolve MemoryService from container', () => {
        const memoryService = container.resolve(MemoryService);
        expect(memoryService).toBeInstanceOf(MemoryService);
        expect(memoryService.createMemory).toBeDefined();
        expect(memoryService.getMemoriesByUser).toBeDefined();
    });

    it('should resolve LlmSelectorService from container', () => {
        const selectorService = container.resolve(LlmSelectorService);
        expect(selectorService).toBeInstanceOf(LlmSelectorService);
        expect(selectorService.pickModel).toBeDefined();
    });

    it('should resolve PlannerService from container', () => {
        const plannerService = container.resolve(PlannerService);
        expect(plannerService).toBeInstanceOf(PlannerService);
    });

    it('should resolve ActionService from container', () => {
        const actionService = container.resolve(ActionService);
        expect(actionService).toBeInstanceOf(ActionService);
    });

    it('should return same instance for singleton services', () => {
        const service1 = container.resolve(MemoryService);
        const service2 = container.resolve(MemoryService);
        expect(service1).toBe(service2);
    });
});
