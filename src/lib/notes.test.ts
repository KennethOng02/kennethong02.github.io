import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { getSlug, parseNote, getAllNotes } from './notes.js';

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
    // gray-matter parses YAML date scalars as Date objects; verified via instanceof Date branch
    expect(note!.date).toBe('2026-01-01');
    expect(note!.tags).toEqual(['fitness']);
    expect(note!.content).toContain('# Hello');
    expect(note!.html).toContain('<h1>');
  });

  it('handles string dates from frontmatter', () => {
    // gray-matter parses unquoted YAML dates as Date objects (see notes.ts date branch)
    // This test verifies the String() fallback path for quoted string dates
    const raw = `---\ntitle: Note\npublish: true\ndate: "2026-01-01"\n---\nContent`;
    const note = parseNote('note.md', raw);
    expect(note!.date).toBe('2026-01-01');
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

describe('getAllNotes', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'notes-test-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns only published notes', () => {
    writeFileSync(join(tmpDir, 'published.md'), '---\ntitle: Pub\npublish: true\n---\nContent');
    writeFileSync(join(tmpDir, 'draft.md'), '---\ntitle: Draft\npublish: false\n---\nContent');
    const notes = getAllNotes(tmpDir);
    expect(notes).toHaveLength(1);
    expect(notes[0].slug).toBe('published');
  });

  it('returns empty array when no published notes exist', () => {
    writeFileSync(join(tmpDir, 'draft.md'), '---\ntitle: Draft\n---\nContent');
    expect(getAllNotes(tmpDir)).toHaveLength(0);
  });
});
