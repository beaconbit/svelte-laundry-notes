export const prerender = false;

import { db } from '$lib/server/db/index';
import { notes } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { markNoteUrgent } from '$lib/server/db';
import { asc } from 'drizzle-orm';
import { desc } from 'drizzle-orm';


export const load = async () => {
  const result = await db.selectDistinct({ machine: notes.engineer }).from(notes).all();
  const allMachines = result.map(x => x.machine);
  console.log(allMachines);
  return { machines: allMachines };
};
