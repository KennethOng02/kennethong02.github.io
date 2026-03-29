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

<h1>Ask the vault</h1>
<p>Ask anything about my notes.</p>

<div class="messages">
  {#each messages as msg}
    <div class="message {msg.role}">
      <span class="label">{msg.role === 'user' ? 'You' : 'Assistant'}</span>
      <p>{msg.content || '…'}</p>
    </div>
  {/each}
</div>

{#if errorMsg}<p class="error">{errorMsg}</p>{/if}

<form onsubmit={(e) => { e.preventDefault(); send(); }}>
  <textarea bind:value={input} onkeydown={onKeydown}
    placeholder="Ask something…" rows="3" disabled={loading}></textarea>
  <button type="submit" disabled={loading || !input.trim()}>
    {loading ? 'Sending…' : 'Send'}
  </button>
</form>

<style>
  .messages { display: flex; flex-direction: column; gap: 1rem; margin: 1.5rem 0; min-height: 2rem; }
  .message { padding: 0.75rem 1rem; border-radius: 8px; background: #f9fafb; }
  .message.user { background: #eff6ff; }
  .label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem; }
  .message p { margin: 0; white-space: pre-wrap; }
  .error { color: #dc2626; }
  form { display: flex; flex-direction: column; gap: 0.5rem; }
  textarea { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; resize: vertical; box-sizing: border-box; }
  button { align-self: flex-end; padding: 0.5rem 1.25rem; background: #111827; color: white; border: none; border-radius: 6px; cursor: pointer; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
