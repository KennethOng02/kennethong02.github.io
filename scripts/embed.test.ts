import { describe, it, expect } from 'vitest';
import { encode } from 'gpt-tokenizer';
import { chunkText } from './embed.js';

describe('chunkText', () => {
  it('returns single chunk for short text', () => {
    const result = chunkText('hello world', 500, 50);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('hello world');
  });

  it('returns empty array for empty input', () => {
    expect(chunkText('', 500, 50)).toHaveLength(0);
  });

  it('splits long text into multiple chunks', () => {
    const longText = 'word '.repeat(500);
    const chunks = chunkText(longText, 100, 20);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it('each chunk fits within maxTokens', () => {
    const longText = 'hello world '.repeat(200);
    const chunks = chunkText(longText, 50, 10);
    for (const chunk of chunks) {
      expect(encode(chunk).length).toBeLessThanOrEqual(50);
    }
  });

  it('adjacent chunks share overlapping tokens', () => {
    const longText = 'alpha beta gamma delta epsilon '.repeat(100);
    const chunks = chunkText(longText, 50, 10);
    if (chunks.length < 2) return; // only meaningful with multiple chunks
    const firstChunkTokens = encode(chunks[0]);
    const secondChunkTokens = encode(chunks[1]);
    // The end of chunk 0 and start of chunk 1 should share ~10 tokens
    const overlapFromEnd = firstChunkTokens.slice(-10);
    const overlapFromStart = secondChunkTokens.slice(0, 10);
    expect(overlapFromEnd).toEqual(overlapFromStart);
  });
});
