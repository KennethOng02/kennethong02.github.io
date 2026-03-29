<script lang="ts">
  import type { PageData } from './$types.js';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>{data.note.title} — Kenneth</title></svelte:head>

<article>
  <div class="mb-8">
    <h1 class="text-3xl font-semibold text-ink mb-2">{data.note.title}</h1>
    {#if data.note.date}
      <p class="text-sm text-muted">{data.note.date}</p>
    {/if}
  </div>

  <div class="prose dark:prose-invert max-w-none">
    {@html data.note.html}
  </div>
</article>

<div class="mt-10 pt-6 border-t border-border">
  <a
    href="/notes"
    class="text-sm text-muted hover:text-ink underline underline-offset-2 transition-colors"
  >
    ← All notes
  </a>
</div>
