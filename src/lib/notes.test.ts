import { describe, it, expect } from 'vitest';
import { getSlug, parseNote } from './notes.js';

describe('getSlug', () => {
  it('lowercases and hyphenates filename', () => {
    expect(getSlug('My Note Title.md')).toBe('my-note-title');
  });
});

describe('parseNote', () => {
  it('returns null when publish is false', () => {
    expect(parseNote('draft.md', '---\ntitle: Draft\npublish: false\n---\nBody')).toBeNull();
  });

  it('returns null when publish is missing', () => {
    expect(parseNote('draft.md', '---\ntitle: Draft\n---\nBody')).toBeNull();
  });

  it('parses a published note', () => {
    const raw = `---
title: My Note
publish: true
date: 2026-01-01
tags: [fitness]
---
# Hello
Body text.`;
    const note = parseNote('my-note.md', raw);
    expect(note).not.toBeNull();
    expect(note!.slug).toBe('my-note');
    expect(note!.title).toBe('My Note');
    expect(note!.date).toBe('2026-01-01');
    expect(note!.tags).toEqual(['fitness']);
    expect(note!.content).toContain('# Hello');
    expect(note!.html).toContain('<h1>');
  });

  it('falls back to filename when title is missing', () => {
    const note = parseNote('my-note.md', '---\npublish: true\n---\nContent');
    expect(note!.title).toBe('my-note');
  });

  it('defaults tags to empty array', () => {
    const note = parseNote('note.md', '---\ntitle: Note\npublish: true\n---\nContent');
    expect(note!.tags).toEqual([]);
  });
});
