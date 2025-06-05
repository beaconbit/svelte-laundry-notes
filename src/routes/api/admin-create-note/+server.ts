import { json } from '@sveltejs/kit';
import { createNote } from '$lib/server/db';

export const POST = async ({ request }) => {
	const { text, engineer } = await request.json();
	const response = await createNote("admin", engineer, text);
	return json({ success: true, body: response });
};

