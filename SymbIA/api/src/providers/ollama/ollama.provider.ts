import { Ollama } from 'ollama';
import { LLMProvider } from '../../interfaces/llm.interface';
import { ThoughtCycleContext } from '../../interfaces/thought-cycle';
import { buildDecisionMessages } from './decision-prompt';

/**
 * Implementação do provedor LLM usando Ollama para executar modelos localmente
 */
export class OllamaProvider implements LLMProvider {
  /**
   * Cliente Ollama para comunicação com a API
   */
  private ollama: Ollama;
  readonly decisionModel = 'llama3:8b';

  constructor() {
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST!
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
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
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

  /**
   * Gera embeddings para uma lista de textos usando o modelo nomic-embed-text
   * @param texts Lista de textos para os quais se deseja gerar embeddings
   * @param model Modelo a ser usado para embeddings (padrão: nomic-embed-text)
   * @returns Promessa que resolve para um array de arrays de números representando os embeddings
   */
  async generateEmbeddings(texts: string[], model: string = 'nomic-embed-text'): Promise<number[][]> {
    try {
      // Verifica se o modelo de embedding existe
      const models = await this.getAvailableModels();
      if (!models.includes(model)) {
        console.warn(`Model ${model} not found. You may need to pull it with 'ollama pull ${model}'`);
      }

      // Gera embeddings para cada texto
      const embeddings: number[][] = [];
      
      for (const text of texts) {
        const response = await this.ollama.embeddings({
          model: model,
          prompt: text
        });
        
        if (response.embedding && Array.isArray(response.embedding)) {
          embeddings.push(response.embedding);
        } else {
          throw new Error('Invalid embedding response format');
        }
      }
      
      return embeddings;
    } catch (error) {
      console.error('Ollama embeddings error:', error);
      throw new Error(`Failed to generate embeddings: ${error}`);
    }
  }

  /**
   * Gera resposta em streaming a partir de múltiplas mensagens (conversação)
   * @param messages Array de mensagens da conversação
   * @param model Modelo a ser usado, com padrão llama3:8b
   * @returns Iterador assíncrono que emite partes da resposta
   */
  async *generateConversationResponse(messages: Array<{role: 'user' | 'assistant', content: string}>, model: string = 'llama3:8b'): AsyncIterable<string> {
    try {
      const response = await this.ollama.chat({
        model: model,
        messages: messages,
        stream: true,
        tools: [],
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
      console.error('Ollama conversation error:', error);
      throw new Error(`Ollama conversation generation failed: ${error}`);
    }
  }

  async decideNextAction(ctx: ThoughtCycleContext): Promise<string> {
    
    const messages = buildDecisionMessages(ctx);

    const response = await this.ollama.chat({
      model: this.decisionModel,
      messages: messages,
      stream: false,
      options: {
        temperature: 0.1 // Lower temperature for more consistent structured output
      }
    });

    return response.message.content;
  }

  async finalizeNextAction(ctx: ThoughtCycleContext): Promise<string> {
    
    const messages = buildDecisionMessages(ctx);

    const response = await this.ollama.chat({
      model: this.decisionModel,
      messages: messages,
      stream: false,
      options: {
        temperature: 0.1 // Lower temperature for more consistent structured output
      }
    });

    return response.message.content;
  }
}
