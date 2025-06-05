import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import  * as schema from './schema';
import { notes } from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = new Database(env.DATABASE_URL);

export const db = drizzle(client, { schema });

export async function deleteNotes(engineer) {
	const note = await db.delete(notes).where(eq(notes.engineer, engineer)).run();
}

export async function getNote(id) {
	const note = await db.select().from(notes).where(eq(notes.id, id)).run();
}

export async function createNote( status, engineer, text) {
  console.log("saving new message: ", text);
  const result = await db.insert(notes).values({ engineer: engineer, text: text, status: status}).returning({ id: notes.id, engineer: notes.engineer, status: notes.status, text: notes.text, created: notes.created });
  return result;
}

export async function markNoteUrgent(id) {
  const result = await db
    .update(notes)
    .set({ status: "urgent" })
    .where(eq(notes.id, id)).run();
  return result;
}
export async function markNoteRecurring(id) {
  const result = await db
    .update(notes)
    .set({ status: "recurring" })
    .where(eq(notes.id, id)).run();
  return result;
}
export async function markNoteSolved(id) {
  const result = await db
    .update(notes)
    .set({ status: "solved" })
    .where(eq(notes.id, id)).run();
  return result;
}

