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
      handleHttpError: ({ path, message }) => {
        // /chat is not yet implemented — ignore its 404 during prerender
        if (path === '/chat') return;
        throw new Error(message);
      },
    },
  },
};

export default config;
