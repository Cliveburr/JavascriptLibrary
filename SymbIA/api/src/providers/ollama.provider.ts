import { Ollama } from 'ollama';
import { LLMProvider } from '../interfaces/llm.interface';

/**
 * Implementação do provedor LLM usando Ollama para executar modelos localmente
 */
export class OllamaProvider implements LLMProvider {
  /**
   * Cliente Ollama para comunicação com a API
   */
  private ollama: Ollama;

  constructor() {
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });
  }

  /**
   * Gera resposta em streaming a partir de uma mensagem
   * @param message Mensagem para a qual se deseja gerar resposta
   * @param model Modelo a ser usado, com padrão llama3:8b
   * @returns Iterador assíncrono que emite partes da resposta
   */
  async *generateResponse(message: string, model: string = 'llama3:8b'): AsyncIterable<string> {
    try {
      const response = await this.ollama.chat({
        model: model,
        messages: [{ role: 'user', content: message }],
        stream: true,
        tools: [
        ],
        options: {
          temperature: 0.2
        }
      });

      for await (const chunk of response) {
        if (chunk.message?.content) {
          yield chunk.message.content;
        }
      }
    } catch (error) {
      console.error('Ollama error:', error);
      throw new Error(`Ollama generation failed: ${error}`);
    }
  }

  /**
   * Gera resposta completa (não em streaming) para uma mensagem
   * @param message Mensagem para a qual se deseja gerar resposta
   * @param model Modelo a ser usado, com padrão llama3:8b
   * @returns Promessa que resolve para a resposta completa
   */
  async generateSingleResponse(message: string, model: string = 'llama3:8b'): Promise<string> {
    try {
      const response = await this.ollama.chat({
        model: model,
        messages: [{ role: 'user', content: message }],
        stream: false,
        options: {
          temperature: 0.1 // Lower temperature for more consistent structured output
        }
      });

      return response.message?.content || '';
    } catch (error) {
      console.error('Ollama single response error:', error);
      throw new Error(`Ollama single response failed: ${error}`);
    }
  }

  /**
   * Verifica se o Ollama está disponível e respondendo
   * @returns Promessa que resolve para um booleano indicando disponibilidade
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.ollama.list();
      return true;
    } catch (error) {
      console.error('Ollama not available:', error);
      return false;
    }
  }

  /**
   * Obtém lista de modelos disponíveis no Ollama
   * @returns Promessa que resolve para um array de strings com os nomes dos modelos
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await this.ollama.list();
      return response.models.map(model => model.name);
    } catch (error) {
      console.error('Failed to get models:', error);
      return [];
    }
  }
}
