<script lang="ts">
  import Video from '../components/Video.svelte'
  import { io } from 'socket.io-client';

  const socket = io()

  socket.on('eventFromServer', (message)=> {
    console.log(message)
  })

</script>

<div>
  <Video />
</div>
