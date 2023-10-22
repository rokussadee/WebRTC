import { sveltekit } from '@sveltejs/kit/vite';
import type { ViteDevServer } from 'vite';
import { defineConfig } from 'vitest/config';
import {Server} from 'socket.io';

export const webSocketServer = {
  name:'webSocketServer',
  configureServer(server: ViteDevServer) {
    if(!server.httpServer) return
    const io = new Server(server.httpServer)

    io.on('connect',(socket) => {
      socket.emit('eventFromServer', 'Connected')
    })
  }
}

const vitePlugins = [webSocketServer]

export default defineConfig({
	plugins: [
    ...vitePlugins,
    sveltekit()
  ],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
