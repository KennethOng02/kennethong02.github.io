import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Note } from './types.js';

export function getSlug(filename: string): string {
  return filename.replace(/\.md$/, '').toLowerCase().replace(/\s+/g, '-');
}

export function parseNote(filename: string, raw: string): Note | null {
  const { data, content } = matter(raw);
  if (!data.publish) return null;
  return {
    slug: getSlug(filename),
    title: typeof data.title === 'string' ? data.title : filename.replace(/\.md$/, ''),
    content,
    html: marked(content) as string,
    date: data.date != null
      ? data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date)
      : undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}

export function getAllNotes(contentDir: string): Note[] {
  const files = readdirSync(contentDir).filter(f => f.endsWith('.md'));
  return files
    .map(f => parseNote(f, readFileSync(join(contentDir, f), 'utf-8')))
    .filter((n): n is Note => n !== null);
}
