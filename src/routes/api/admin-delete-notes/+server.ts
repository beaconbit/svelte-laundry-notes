import { json } from '@sveltejs/kit';
import { deleteNotes } from '$lib/server/db';

export const POST = async ({ request }) => {
	const { engineer } = await request.json();
	const response = await deleteNotes(engineer);
	return json({ success: true, body: response });
};

