<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

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
        <a
          href="/notes"
          class="text-sm transition-colors {$page.url.pathname.startsWith('/notes')
            ? 'nav-active text-ink'
            : 'text-muted hover:text-ink'}"
        >Notes</a>
        <a
          href="/chat"
          class="text-sm transition-colors {$page.url.pathname.startsWith('/chat')
            ? 'nav-active text-ink'
            : 'text-muted hover:text-ink'}"
        >Chat</a>
        <button
          type="button"
          onclick={toggleDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          class="text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded p-1 -mr-1"
        >
          {#if isDark}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="1.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="1.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          {/if}
        </button>
      </div>
    </nav>
  </header>

  <main class="animate-fade-in-up flex-1 max-w-2xl mx-auto w-full px-6 md:px-8 py-10">
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
