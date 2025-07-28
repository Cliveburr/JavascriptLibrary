import { describe, it, expect } from 'vitest';
import { pickModel, LlmSelectorService } from '../src/llm/selector.js';

describe('LLM Selector', () => {
  describe('pickModel function', () => {
    it('should return correct model for fast-chat', () => {
      const model = pickModel('fast-chat');
      expect(model.provider).toBe('ollama');
      expect(model.model).toBe('phi3');
    });

    it('should return correct model for reasoning', () => {
      const model = pickModel('reasoning');
      expect(model.provider).toBe('openai');
      expect(model.model).toBe('gpt-4o');
    });

    it('should return correct model for embedding', () => {
      const model = pickModel('embedding');
      expect(model.provider).toBe('ollama');
      expect(model.model).toBe('nomic-embed-text');
    });
  });

  describe('LlmSelectorService', () => {
    const service = new LlmSelectorService();

    it('should return correct model for fast-chat', () => {
      const model = service.pickModel('fast-chat');
      expect(model.provider).toBe('ollama');
      expect(model.model).toBe('phi3');
    });

    it('should return correct model for reasoning', () => {
      const model = service.pickModel('reasoning');
      expect(model.provider).toBe('openai');
      expect(model.model).toBe('gpt-4o');
    });

    it('should return correct model for embedding', () => {
      const model = service.pickModel('embedding');
      expect(model.provider).toBe('ollama');
      expect(model.model).toBe('nomic-embed-text');
    });
  });
});
