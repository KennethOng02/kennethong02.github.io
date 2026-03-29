<script lang="ts">
  import type { Message } from '$lib/types.js';

  let messages = $state<Message[]>([]);
  let input = $state('');
  let loading = $state(false);
  let errorMsg = $state('');

  const apiUrl = import.meta.env.VITE_API_URL || '/api/chat';

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    messages = [...messages, { role: 'user', content: text }];
    input = '';
    loading = true;
    errorMsg = '';

    const assistantMsg: Message = { role: 'assistant', content: '' };
    messages = [...messages, assistantMsg];
    const idx = messages.length - 1;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.slice(0, -1) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        messages[idx] = { ...messages[idx], content: messages[idx].content + decoder.decode(value) };
        messages = messages;
      }
    } catch {
      errorMsg = 'Something went wrong. Please try again.';
      messages = messages.slice(0, -1);
    } finally {
      loading = false;
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }
</script>

<svelte:head><title>Chat — Ask the vault</title></svelte:head>

<h1 class="text-3xl font-semibold text-ink mb-2">Ask the vault</h1>
<p class="text-muted mb-6">Ask anything about my notes.</p>

<div class="flex flex-col gap-4 mb-6 min-h-8">
  {#each messages as msg}
    {#if msg.role === 'user'}
      <div class="self-end max-w-[80%] bg-surface rounded-2xl rounded-br-sm px-4 py-3">
        <p class="text-sm text-ink whitespace-pre-wrap m-0">{msg.content || '…'}</p>
      </div>
    {:else}
      <div class="self-start max-w-[80%] px-1">
        <p class="text-sm text-muted text-[10px] uppercase tracking-wider font-semibold mb-1">Assistant</p>
        <p class="text-base text-ink leading-relaxed whitespace-pre-wrap m-0">{msg.content || '…'}</p>
      </div>
    {/if}
  {/each}
</div>

{#if errorMsg}
  <p class="text-red-500 text-sm mb-4">{errorMsg}</p>
{/if}

<form onsubmit={(e) => { e.preventDefault(); send(); }} class="flex flex-col gap-2">
  <textarea
    bind:value={input}
    onkeydown={onKeydown}
    placeholder="Ask something…"
    rows="3"
    disabled={loading}
    class="w-full px-4 py-3 border border-border rounded-xl text-base text-ink bg-bg
           placeholder:text-muted resize-none focus:outline-none focus:ring-2
           focus:ring-accent/20 disabled:opacity-50 transition-colors"
  ></textarea>
  <button
    type="submit"
    disabled={loading || !input.trim()}
    class="self-end px-5 py-2 bg-accent text-bg text-sm font-medium rounded-lg
           disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
  >
    {loading ? 'Sending…' : 'Send'}
  </button>
</form>
