import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';

const isVercel = !!process.env.VERCEL;

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: isVercel
      ? adapterVercel()
      : adapterStatic({ fallback: '404.html' }),
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore 404s for routes not yet implemented (e.g. /chat)
        if (message.includes('404')) return;
        throw new Error(message);
      },
    },
  },
};

export default config;
