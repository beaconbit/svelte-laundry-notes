export const prerender = false;

import { db } from '$lib/server/db/index';
import { notes } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { markNoteUrgent } from '$lib/server/db';
import { asc, eq, desc } from 'drizzle-orm';


export const load = async () => {
  const result = await db.select().from(notes).where(eq(notes.status, 'urgent')).all();
  return { result };
};
