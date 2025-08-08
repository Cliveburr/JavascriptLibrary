export class ServiceRegistry {
    private static instance: ServiceRegistry;
    private services: Map<string, unknown> = new Map();

    private constructor() { }

    static getInstance(): ServiceRegistry {
        if (!ServiceRegistry.instance) {
            ServiceRegistry.instance = new ServiceRegistry();
        }
        return ServiceRegistry.instance;
    }

    register<T>(key: string, instance: T): void {
        this.services.set(key, instance);
    }

    get<T>(key: string): T {
        const service = this.services.get(key);
        if (!service) {
            throw new Error(`Service ${key} not found in registry`);
        }
        return service as T;
    }

    getOptional<T>(key: string): T | undefined {
        return this.services.get(key) as T;
    }

    has(key: string): boolean {
        return this.services.has(key);
    }

    clear(): void {
        this.services.clear();
    }
}
