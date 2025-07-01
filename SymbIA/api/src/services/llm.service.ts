import { LLMProvider } from '../interfaces/llm.interface';
import { OllamaProvider } from '../providers/ollama.provider';

/**
 * Gerencia os diferentes provedores de LLM disponíveis na aplicação
 */
export class LLMManager {
  /**
   * Mapa de provedores LLM registrados pelo nome
   */
  private providers: Map<string, LLMProvider> = new Map();

  constructor() {
    // Initialize providers
    this.providers.set('ollama', new OllamaProvider());
  }

  /**
   * Obtém um provedor LLM específico pelo nome
   * @param name Nome do provedor
   * @returns O provedor LLM correspondente ou undefined se não encontrado
   */
  getProvider(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Obtém a lista de nomes de todos os provedores registrados
   * @returns Array com os nomes dos provedores
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Encontra e retorna o primeiro provedor LLM disponível
   * @returns Promessa que resolve para o primeiro provedor disponível ou null se nenhum estiver disponível
   */
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
