import { json } from '@sveltejs/kit';
import { markNoteSolved } from '$lib/server/db';

export const POST = async ({ request }) => {
	const { id } = await request.json();
	console.log("marking note solved ", id);
	await markNoteSolved(id);
	return json({ success: true });
};

