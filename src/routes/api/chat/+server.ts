export const prerender = false;

import { error } from '@sveltejs/kit';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY } from '$env/static/private';
import type { RequestHandler } from './$types.js';
import type { Message } from '$lib/types.js';

const SIMILARITY_THRESHOLD = 0.3;
const MAX_CHUNKS = 5;
const MAX_HISTORY = 6;

const CORS = {
  'Access-Control-Allow-Origin': 'https://kennethong02.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: RequestHandler = () =>
  new Response(null, { status: 204, headers: CORS });

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body?.messages || !Array.isArray(body.messages)) throw error(400, 'messages array required');

  const messages: Message[] = body.messages;
  const userQuery = messages.at(-1)?.content;
  if (!userQuery) throw error(400, 'last message must have content');

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const embeddingRes = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userQuery,
  });
  const queryEmbedding = embeddingRes.data[0].embedding;

  const { data: chunks, error: dbErr } = await supabase.rpc('match_note_chunks', {
    query_embedding: queryEmbedding,
    match_threshold: SIMILARITY_THRESHOLD,
    match_count: MAX_CHUNKS,
  });

  if (dbErr) throw error(500, 'Database error');

  const context = chunks?.length
    ? chunks
        .map((c: { note_title: string; content: string }) => `[${c.note_title}]\n${c.content}`)
        .join('\n\n')
    : null;

  const systemPrompt = context
    ? `You are an AI assistant for Kenneth's personal site. Answer the visitor's question using the following notes as context. Be concise and accurate.\n\nRelevant notes:\n\n${context}`
    : `You are an AI assistant for Kenneth's personal site. You couldn't find any notes relevant to this question. Tell the visitor honestly that you don't have information on this topic.`;

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-MAX_HISTORY).map(m => ({ role: m.role, content: m.content })),
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
