import { sveltekit } from '@sveltejs/kit/vite';
import type { ViteDevServer } from 'vite';
import { defineConfig } from 'vitest/config';
import {createNewRoom, joinLastCreatedRoom} from './src/common/roomManager.ts';
import { callId } from './src/stores.js';
import { get } from 'svelte/store';
import {Server} from 'socket.io';

export const webSocketServer = {
  name:'webSocketServer',
  configureServer(server: ViteDevServer) {
    if(!server.httpServer) return
    const io = new Server(server.httpServer)

    io.on('connect',(socket) => {
      socket.emit('eventFromServer', 'Connected')

      let clientsCount = io.engine.clientsCount
      let is_creator: boolean = false
      console.log(clientsCount)

      if((clientsCount - 1) % 2 === 0) {
        //create room
        console.log('connected socker is first of two users')
        is_creator= true;
        createNewRoom(socket)
      }
      //always join room with that roomid, whether or not you are the creator
      const room_id = joinLastCreatedRoom(socket)
      socket.emit('receive-room_id', room_id, is_creator)

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
