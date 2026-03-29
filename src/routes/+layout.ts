// All routes prerender by default for adapter-static (GitHub Pages).
// The API route overrides this with `export const prerender = false`.
// The /chat page is a static shell — it fetches the API client-side at runtime.
export const prerender = true;
export const trailingSlash = 'always';
