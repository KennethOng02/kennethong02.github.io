<script lang="ts">
  import type { PageData } from './$types.js';
  let { data }: { data: PageData } = $props();

  const notesByYear = $derived.by(() => {
    const groups = new Map<string, typeof data.notes>();
    for (const note of data.notes) {
      const year = note.date ? note.date.slice(0, 4) : 'Undated';
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year)!.push(note);
    }
    return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a));
  });
</script>

<svelte:head><title>Notes — Kenneth</title></svelte:head>

<h1 class="font-serif text-4xl font-bold tracking-tight text-ink mb-10">Notes</h1>

{#if data.notes.length === 0}
  <p class="text-muted">No published notes yet.</p>
{:else}
  {#each notesByYear as [year, notes]}
    <section class="mb-8">
      <h2 class="text-xs font-semibold tracking-widest text-muted uppercase mb-3">{year}</h2>
      <ul class="space-y-2">
        {#each notes as note}
          <li class="grid grid-cols-[1fr_auto] items-baseline gap-8">
            <a
              href="/notes/{note.slug}"
              class="text-ink hover:text-muted underline underline-offset-2 decoration-transparent hover:decoration-border transition-all"
            >
              {note.title}
            </a>
            {#if note.date}
              <span class="text-sm text-muted tabular-nums shrink-0">{note.date.slice(5)}</span>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/each}
{/if}
