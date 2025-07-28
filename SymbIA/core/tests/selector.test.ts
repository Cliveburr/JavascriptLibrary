import { describe, it, expect } from 'vitest';
import { pickModel } from '../src/llm/selector.js';

describe('LLM Selector', () => {
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
