import { getAllNotes } from '$lib/notes.js';
import { join } from 'path';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types.js';

const contentDir = join(process.cwd(), 'content');
const allNotes = getAllNotes(contentDir);

export const entries: EntryGenerator = () => allNotes.map(n => ({ slug: n.slug }));

export const load: PageServerLoad = ({ params }) => {
  const note = allNotes.find(n => n.slug === params.slug);
  if (!note) throw error(404, 'Note not found');
  return { note };
};
