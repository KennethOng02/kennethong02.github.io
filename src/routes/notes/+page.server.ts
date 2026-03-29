import { getAllNotes } from '$lib/notes.js';
import { join } from 'path';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = () => {
  const notes = getAllNotes(join(process.cwd(), 'content'));
  return { notes: notes.map(({ slug, title, date, tags }) => ({ slug, title, date, tags })) };
};
