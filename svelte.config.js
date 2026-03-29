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
  },
};

export default config;
