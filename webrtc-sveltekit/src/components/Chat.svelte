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

<div>
  <ul>
    {#each messages as msg (msg.id)}
      {#if msg.author === socket.id}
        <li class="authorMsg">{msg.text}</li>
      {:else}
        <li class="peerMsg">{msg.text}</li>
      {/if}
    {/each}
  </ul>
  <input type="text" bind:value={message} on:keydown={(e) => e.key === 'Enter' && sendMessage()} />
  <button on:click={sendMessage}>Send</button>
</div>

<style>
  .authorMsg {
    color: red;
  }
  .peerMsg{
    color: blue;
  }
</style>
