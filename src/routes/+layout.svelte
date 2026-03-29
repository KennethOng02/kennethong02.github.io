<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';

  let { children }: { children: Snippet } = $props();
  let isDark = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  function toggleDark() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<div class="min-h-screen bg-bg text-ink font-sans flex flex-col">
  <header class="border-b border-border px-6 md:px-8">
    <nav class="max-w-2xl mx-auto flex items-center justify-between h-14">
      <a href="/" class="font-semibold text-ink hover:text-muted transition-colors">
        Kenneth
      </a>
      <div class="flex items-center gap-6">
        <a href="/notes" class="text-sm text-muted hover:text-ink transition-colors">Notes</a>
        <a href="/chat" class="text-sm text-muted hover:text-ink transition-colors">Chat</a>
        <button
          onclick={toggleDark}
          aria-label="Toggle dark mode"
          class="text-muted hover:text-ink transition-colors text-lg leading-none"
        >
          {isDark ? '☀' : '◑'}
        </button>
      </div>
    </nav>
  </header>

  <main class="flex-1 max-w-2xl mx-auto w-full px-6 md:px-8 py-10">
    {@render children()}
  </main>

  <footer class="border-t border-border px-6 md:px-8">
    <div class="max-w-2xl mx-auto flex items-center justify-between h-12 text-sm text-muted">
      <span>© {new Date().getFullYear()} Kenneth</span>
      <a
        href="https://github.com/kennethong02"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-ink transition-colors"
      >
        GitHub
      </a>
    </div>
  </footer>
</div>
