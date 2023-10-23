import { sveltekit } from '@sveltejs/kit/vite';
import type { ViteDevServer } from 'vite';
import { defineConfig } from 'vitest/config';
import {createNewRoom, joinLastCreatedRoom} from './src/common/roomManager.ts';
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

      socket.on('message', (data) => {
        const messageObject = {
          roomId: data.roomId,
          text: data.text,
          id: Date.now(),
          author: socket.id
        }
      
        // Broadcast the message to all participants in the room
        io.to(room_id).emit('message', messageObject);
      
        // Store the message
      });
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
