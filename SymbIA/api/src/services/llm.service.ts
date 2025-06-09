import { LLMProvider } from '../interfaces/llm.interface';
import { OllamaProvider } from '../providers/ollama.provider';

export class LLMManager {
  private providers: Map<string, LLMProvider> = new Map();

  constructor() {
    // Initialize providers
    this.providers.set('ollama', new OllamaProvider());
  }

  getProvider(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async getAvailableProvider(): Promise<LLMProvider | null> {
    for (const [name, provider] of this.providers) {
      const isAvailable = await provider.isAvailable();
      if (isAvailable) {
        console.log(`Using provider: ${name}`);
        return provider;
      }
    }
    return null;
  }
}
