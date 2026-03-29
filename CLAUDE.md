# my-site — Claude Code Context

Personal website for Kenneth. Static site on GitHub Pages + RAG chat API on Vercel, powered by an Obsidian vault.

## Architecture

- **Frontend:** SvelteKit with `adapter-static` → GitHub Pages (`https://kennethong02.github.io/`)
- **API:** SvelteKit with `adapter-vercel` → Vercel (`https://kennethong02-github-io.vercel.app/api/chat`)
- **Vector DB:** Supabase pgvector (`note_chunks` table)
- **Embedding pipeline:** `scripts/embed.ts` — runs in CI before every build
- **LLM:** OpenAI `gpt-4o-mini` (chat) + `text-embedding-3-small` (embeddings)

The adapter is chosen at build time: `adapter-vercel` when `process.env.VERCEL` is set, `adapter-static` otherwise.

## Key Files

| File | Purpose |
|---|---|
| `src/lib/types.ts` | Shared types: `Note`, `Message` |
| `src/lib/notes.ts` | Vault parsing — reads `content/`, filters `publish: true` |
| `src/lib/notes.test.ts` | Unit tests for note parsing (9 tests) |
| `src/routes/api/chat/+server.ts` | RAG endpoint — embed → pgvector → gpt-4o-mini stream |
| `src/routes/chat/+page.svelte` | Chat UI (Svelte 5, streaming) |
| `src/routes/notes/` | Notes index + individual note pages |
| `scripts/embed.ts` | Embedding pipeline — chunk → embed → upsert to Supabase |
| `scripts/embed.test.ts` | Unit tests for `chunkText` (5 tests) |
| `content/` | Published vault notes (`.md` files with `publish: true`) |
| `.github/workflows/deploy.yml` | CI: embed → build → deploy to GitHub Pages |

## Svelte Version

This project uses **Svelte 5**. Always use Svelte 5 syntax:
- `let { data } = $props()` not `export let data`
- `let x = $state(val)` not `let x = val` for reactive state
- `onsubmit={handler}` not `on:submit={handler}`
- `{@render children()}` not `<slot />`

## Publishing a Note

1. Copy `.md` file into `content/`
2. Add `publish: true` to frontmatter (also set `title`, `date`, `tags`)
3. Push to `main` — CI embeds it and rebuilds the site

## Environment Variables

**Local (`.env`):**
- `OPENAI_API_KEY` — OpenAI API key
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_KEY` — Supabase service role key
- `VITE_API_URL` — Vercel API URL (e.g. `https://kennethong02-github-io.vercel.app/api/chat`)

**GitHub Secrets** (same four keys, used in CI)

**Vercel** (set in dashboard): `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

## Commands

```bash
npm run dev          # local dev server
npm run build        # static build (adapter-static)
npm run check        # TypeScript + Svelte type check
npm test             # run all tests (vitest)
npx tsx scripts/embed.ts  # run embedding pipeline locally
```

## Supabase Schema

```sql
-- note_chunks table with HNSW index
-- match_note_chunks(query_embedding, match_threshold, match_count) RPC function
-- See: docs/superpowers/specs/2026-03-29-personal-site-design.md
```

## Design Docs

- Spec: `docs/superpowers/specs/2026-03-29-personal-site-design.md` (in notes vault)
- Plan: `docs/superpowers/plans/2026-03-29-personal-site.md` (in notes vault)
