<script lang="ts">
  import type { PageData } from './$types.js';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>{data.note.title}</title></svelte:head>

<article>
  <h1>{data.note.title}</h1>
  {#if data.note.date}<p class="meta">{data.note.date}</p>{/if}
  {@html data.note.html}
</article>

<a href="/notes">← All notes</a>

<style>
  .meta { color: #6b7280; font-size: 0.875rem; }
  article :global(h1) { margin-top: 1.5rem; }
  article :global(h2) { margin-top: 1.5rem; }
  article :global(h3) { margin-top: 1.5rem; }
  article :global(p) { line-height: 1.7; }
  article :global(code) { background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 3px; }
  article :global(pre) { background: #f3f4f6; padding: 1rem; border-radius: 6px; overflow-x: auto; }
</style>
