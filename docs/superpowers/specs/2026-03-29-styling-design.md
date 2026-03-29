# Styling Design — kenneth's personal site

**Date:** 2026-03-29
**Status:** Approved

## Overview

Style the personal site with a minimal, clean aesthetic using Tailwind CSS. No UI component library. Dark mode support via class-based toggle. Custom web font (Geist Sans).

## Stack

- **Tailwind CSS** — utility classes, design tokens, dark mode
- **@tailwindcss/typography** — prose styles for rendered Markdown on note pages
- **@fontsource/geist** — self-hosted Geist Sans font, no external requests
- Dark mode strategy: `class` (manual toggle, persisted to `localStorage`)

## Design Tokens

CSS custom properties defined in `app.css`, mapped to Tailwind config:

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#ffffff` | `#0a0a0a` |
| `--color-surface` | `#f9fafb` | `#111111` |
| `--color-border` | `#e5e7eb` | `#222222` |
| `--color-text` | `#111827` | `#f5f5f5` |
| `--color-muted` | `#6b7280` | `#737373` |
| `--color-accent` | `#111827` | `#f5f5f5` |

## Typography

- Font family: Geist Sans (via `@fontsource/geist`)
- Body: `text-base` (16px), `leading-relaxed`
- Headings: `text-3xl font-semibold` (h1), `text-2xl` (h2), etc.
- Muted metadata: `text-sm text-muted`
- Links: `underline underline-offset-2`

## Layout

- Max-width container: `max-w-2xl` (672px), centered, `mx-auto`
- Page padding: `px-6 py-8` (mobile), `px-8` (md+)

### Navigation (layout.svelte)

- Top bar with `border-b border-[--color-border]`
- Left: "Kenneth" as home link
- Right: Notes, Chat links + dark mode toggle (sun/moon icon)
- No hamburger — 3 links fit inline on mobile

### Footer

- Single line: year + GitHub link
- `border-t border-[--color-border]`, muted text

## Page Styles

### Home (`/`)

- `text-3xl font-semibold` heading
- `text-base leading-relaxed` body copy
- Links with `underline underline-offset-2`

### Notes index (`/notes`)

- Flat list, no cards, no bullets
- Each row: `title — date`, `space-y-3` vertical rhythm
- Date in `text-muted text-sm`
- Hover: title color shift only

### Note page (`/notes/[slug]`)

- `prose dark:prose-invert` from `@tailwindcss/typography`
- Handles headings, blockquotes, code blocks, lists automatically

### Chat (`/chat`)

- User messages: `bg-[--color-surface]` bubble, right-aligned
- Assistant messages: plain, left-aligned, no background
- Textarea: `border border-[--color-border]` with `rounded-md`
- Send button: accent background, disabled state with `opacity-50`
- Loading state: animated ellipsis (`…`) or subtle pulse

## Dark Mode

- Toggle adds/removes `dark` class on `<html>`
- Preference persisted to `localStorage`
- Toggle button in nav: sun icon (light mode) / moon icon (dark mode)
- Inline script in `<head>` applies saved preference before first paint (avoids flash)

## Files to Change

| File | Change |
|---|---|
| `package.json` | Add `tailwindcss`, `@tailwindcss/typography`, `@fontsource/geist` |
| `tailwind.config.ts` | Create — darkMode: 'class', extend colors with CSS vars, add typography plugin |
| `vite.config.ts` | Add Tailwind as PostCSS plugin (or use `@tailwindcss/vite`) |
| `src/app.css` | Replace with CSS vars + Tailwind directives + font import |
| `src/routes/+layout.svelte` | Restyle header/nav, add footer, add dark mode toggle with localStorage logic |
| `src/routes/+page.svelte` | Apply Tailwind classes |
| `src/routes/notes/+page.svelte` | Apply Tailwind classes |
| `src/routes/notes/[slug]/+page.svelte` | Apply `prose dark:prose-invert` |
| `src/routes/chat/+page.svelte` | Restyle chat bubbles, form, button |
