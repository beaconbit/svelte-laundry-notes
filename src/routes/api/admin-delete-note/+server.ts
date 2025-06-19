import { json } from '@sveltejs/kit';
import { deleteNote } from '$lib/server/db';

export const POST = async ({ request }) => {
	const { id } = await request.json();
	const response = await deleteNote(id);
	return json({ success: true, body: response });
};

