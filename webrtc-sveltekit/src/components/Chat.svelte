<script lang="ts">
  import { onMount } from 'svelte';
  import socket from "../clientsocket.ts";

  export let roomId: string;

  let message: string = '';
  let messages: { id: number; text: string }[] = [];

  // Connect to the Socket.io server and join the room
  onMount(() => {

    // Listen for incoming messages
    socket.on('message', (data: { roomId: number; text: string,id: date, author: string}) => {
      messages = [...messages, data];
    });

    // Clean up when the component is unmounted
    return () => {
      socket.disconnect();
    };
  });

  // Function to send a chat message
  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('message', { roomId, text: message });
      message = '';     
    }
  };
</script>

<div class="w-10/12 px-10">
  <ul>
    {#each messages as msg (msg.id)}
      {#if msg.author === socket.id}
        
<div class="grid grid-cols-[auto_1fr] gap-2">
	<div class="card p-4 variant-soft rounded-tl-none space-y-2">
		<header class="flex justify-between items-center">
			<p class="font-bold">You</p>
			<small class="opacity-50">{msg.id}</small>
		</header>
		<p>{msg.text}</p>
	</div>
</div>

      {:else}
        
<div class="grid grid-cols-[1fr_auto] gap-2">
	<div class="card p-4 rounded-tr-none space-y-2">
		<header class="flex justify-between items-center">
			<p class="font-bold">Anonymous</p>
			<small class="opacity-50">{msg.id}</small>
		</header>
		<p>{msg.text}</p>
	</div>
</div>

      {/if}
    {/each}
  </ul>
  <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
	  <button class="input-group-shim">+</button>
	<textarea
   bind:value={message}
   on:keydown={(e) => e.key === 'Enter' && sendMessage()}
		class="bg-transparent border-0 ring-0"
		name="prompt"
		id="prompt"
		placeholder="Write a message..."
		rows="1"
	/>
	<button on:click={sendMessage} class="variant-filled-primary">Send</button>
</div>
</div>
<style>
  .authorMsg {
    color: red;
  }
  .peerMsg{
    color: blue;
  }
</style>
