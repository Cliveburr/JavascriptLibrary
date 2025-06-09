import { Ollama } from 'ollama';
import { LLMProvider } from '../interfaces/llm.interface';

export class OllamaProvider implements LLMProvider {
  private ollama: Ollama;

  constructor() {
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });
  }

  async *generateResponse(message: string, model: string = 'llama3.2:latest'): AsyncIterable<string> {
    try {
      const response = await this.ollama.chat({
        model: model,
        messages: [{ role: 'user', content: message }],
        stream: true,
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

  async isAvailable(): Promise<boolean> {
    try {
      await this.ollama.list();
      return true;
    } catch (error) {
      console.error('Ollama not available:', error);
      return false;
    }
  }

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
