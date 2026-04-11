<script lang="ts">
  import type { PageData } from './$types.js';
  let { data }: { data: PageData } = $props();

  const formattedDate = $derived(
    data.note.date
      ? new Date(data.note.date + 'T00:00:00').toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      : null
  );
</script>

<svelte:head><title>{data.note.title} — Kenneth</title></svelte:head>

<article>
  <header class="mb-8">
    <h1 class="font-serif text-4xl font-bold tracking-tight text-ink mb-3 leading-tight">
      {data.note.title}
    </h1>
    {#if formattedDate}
      <p class="text-sm text-muted tabular-nums">{formattedDate}</p>
    {/if}
    <hr class="border-border mt-6" />
  </header>

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
