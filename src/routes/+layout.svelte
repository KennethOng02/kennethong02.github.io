<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<header>
  <nav>
    <a href="/">Home</a>
    <a href="/notes">Notes</a>
    <a href="/chat">Chat</a>
  </nav>
</header>

<main>
  {@render children()}
</main>

<style>
  header { padding: 1rem 2rem; border-bottom: 1px solid #e5e7eb; }
  nav { display: flex; gap: 1.5rem; }
  nav a { text-decoration: none; color: #374151; font-weight: 500; }
  nav a:hover { color: #111827; }
  main { max-width: 48rem; margin: 0 auto; padding: 2rem; }
</style>
