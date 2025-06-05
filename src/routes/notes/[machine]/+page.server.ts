export const prerender = false;

import { db } from '$lib/server/db/index';
import { notes } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';
import { eq, and, ne } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

// +page.server.ts
export const load = async ({ params }) => {
	const machine = params.machine;

	const results = await db.select().from(notes).where(and(eq(notes.engineer, machine), ne(notes.status, 'admin'))).orderBy(desc(notes.created)).limit(10);

	if (!machine) {
		throw error(404, 'Machine not found');
	}

	return { notes: results, machine: machine };
};

