<script lang="ts">
  import type { PageData } from './$types.js';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Notes</title></svelte:head>

<h1>Notes</h1>

{#if data.notes.length === 0}
  <p>No published notes yet.</p>
{:else}
  <ul>
    {#each data.notes as note}
      <li>
        <a href="/notes/{note.slug}">{note.title}</a>
        {#if note.date}<span class="date"> — {note.date}</span>{/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul { list-style: none; padding: 0; }
  li { margin-bottom: 0.75rem; }
  .date { color: #6b7280; font-size: 0.875rem; }
</style>
