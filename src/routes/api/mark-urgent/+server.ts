import { json } from '@sveltejs/kit';
import { markNoteUrgent } from '$lib/server/db';

export const POST = async ({ request }) => {
	const { id } = await request.json();
	console.log("marking note urgent ", id);
	await markNoteUrgent(id);
	return json({ success: true });
};

