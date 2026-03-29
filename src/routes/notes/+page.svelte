<script lang="ts">
  import type { PageData } from './$types.js';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Notes — Kenneth</title></svelte:head>

<h1 class="text-3xl font-semibold text-ink mb-8">Notes</h1>

{#if data.notes.length === 0}
  <p class="text-muted">No published notes yet.</p>
{:else}
  <ul class="space-y-3">
    {#each data.notes as note}
      <li class="flex items-baseline gap-2">
        <a
          href="/notes/{note.slug}"
          class="text-ink hover:text-muted underline underline-offset-2 transition-colors"
        >
          {note.title}
        </a>
        {#if note.date}
          <span class="text-sm text-muted">— {note.date}</span>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
