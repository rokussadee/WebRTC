<script lang="ts">
  import { onMount } from 'svelte';
  import Video from '../components/Video.svelte'
  import socket from "../clientsocket.ts";

  let roomId: string;

  onMount(()=> {
  
    socket.on('eventFromServer', (message)=> {
      console.log(message)
    })
  
    socket.on('receive-room_id', (room_id) => {
      roomId = room_id
    })
  
  })
</script>

<div>
  <p>You have joined {roomId}</p>
  <Video />
</div>
