import { sveltekit } from '@sveltejs/kit/vite';
import type { ViteDevServer } from 'vite';
import { defineConfig } from 'vitest/config';
import {createNewRoom, joinLastCreatedRoom, lastCreatedRoomID, linkUserToRoom} from './src/common/roomManager.ts';
import {Server} from 'socket.io';

export const webSocketServer = {
  name:'webSocketServer',
  configureServer(server: ViteDevServer) {
    if(!server.httpServer) return
    const io = new Server(server.httpServer)

    io.on('connect',(socket) => {
      socket.emit('eventFromServer', 'Connected')

      let clientsCount = io.engine.clientsCount
      console.log(clientsCount)

      if((clientsCount - 1) % 2 === 0) {
        //create room
        console.log('connected socker is first of two users')
        createNewRoom(socket)
      }
      //always join room with that roomid, whether or not you are the creator
      const room_id = joinLastCreatedRoom(socket)
      socket.emit('receive-room_id', room_id)
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
