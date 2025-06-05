import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
        plugins: [sveltekit()],
        server: {
                port: 5173,
                host: true, // allow external access
                allowedHosts: ['wasp-test.au.ngrok.io']
        }
});
