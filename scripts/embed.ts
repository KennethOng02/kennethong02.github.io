import 'dotenv/config';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { encode, decode } from 'gpt-tokenizer';
import { parseNote } from '../src/lib/notes.js';

const CONTENT_DIR = join(process.cwd(), 'content');
const MAX_TOKENS = 500;
const OVERLAP_TOKENS = 50;
const BATCH_SIZE = 100;

export function chunkText(text: string, maxTokens: number, overlap: number): string[] {
  const tokens = encode(text);
  if (tokens.length === 0) return [];
  if (tokens.length <= maxTokens) return [text];

  const chunks: string[] = [];
  let start = 0;
  while (start < tokens.length) {
    const end = Math.min(start + maxTokens, tokens.length);
    chunks.push(decode(tokens.slice(start, end)));
    if (end === tokens.length) break;
    start = end - overlap;
  }
  return chunks;
}

async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  const rows: { note_slug: string; note_title: string; chunk_index: number; content: string }[] = [];

  for (const file of files) {
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf-8');
    const note = parseNote(file, raw);
    if (!note) continue;
    chunkText(note.content, MAX_TOKENS, OVERLAP_TOKENS).forEach((content, i) => {
      rows.push({ note_slug: note.slug, note_title: note.title, chunk_index: i, content });
    });
  }

  if (rows.length === 0) { console.log('No published notes found.'); return; }

  const embeddings: number[][] = [];
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE).map(r => r.content);
    const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: batch });
    embeddings.push(...res.data.map(d => d.embedding));
    console.log(`Embedded ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length} chunks`);
  }

  const records = rows.map((row, i) => ({ ...row, embedding: embeddings[i] }));
  const { error } = await supabase
    .from('note_chunks')
    .upsert(records, { onConflict: 'note_slug,chunk_index' });

  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
  console.log(`Done. Upserted ${records.length} chunks.`);
}

// Only run when executed directly, not when imported by tests
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => { console.error(err); process.exit(1); });
}
