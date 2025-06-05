import { json } from '@sveltejs/kit';
import { createNote } from '$lib/server/db';

export const POST = async ({ request }) => {
	const { text, engineer } = await request.json();
	const response = await createNote("new", engineer, text);
	return json({ success: true, body: response });
};

