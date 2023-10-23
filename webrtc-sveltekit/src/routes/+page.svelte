<script lang="ts">
  import { onMount } from 'svelte';
  import Video from '../components/Video.svelte'
  import Chat from '../components/Chat.svelte'
  import socket from "../clientsocket.ts";

  let roomId: string;
  let isCreator: boolean;

  onMount(()=> {
  
    socket.on('eventFromServer', (message)=> {
      console.log(message)
    })
  
    socket.on('receive-room_id', (room_id, is_creator ) => {
      roomId = room_id
      isCreator = is_creator
    })
  
  })
</script>

<div>
  <p>You have joined {roomId}</p>
  <Video {isCreator} {roomId}/>
  <Chat {roomId} />
</div>
