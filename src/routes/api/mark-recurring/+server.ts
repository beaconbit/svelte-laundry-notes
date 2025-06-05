import { json } from '@sveltejs/kit';
import { markNoteRecurring } from '$lib/server/db';

export const POST = async ({ request }) => {
	const { id } = await request.json();
	console.log("marking note recurring ", id);
	await markNoteRecurring(id);
	return json({ success: true });
};

