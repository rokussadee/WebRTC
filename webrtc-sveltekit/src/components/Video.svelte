<script lang="ts">
  import { onMount } from 'svelte';
  import {pc} from '../firebase';
  import {callService} from '../services/callService.ts';
  import {webcamActive, callId} from '../stores.ts';
  import socket from "../clientsocket.ts";

  export let isCreator: boolean;
  export let roomId: string;

  let localStream: MediaStream | null = null;
  let remoteStream: MediaStream | null = null;
  let localVideo: HTMLNodeElement;
  let remoteVideo: HTMLNodeElement;

  let webcamState: boolean;

  onMount(()=> {
    setupWebcam()
    .then(()=> {
      if(!isCreator) {
        answer()
      } else {
        call()
      }
    })

    return () => {
      socket.disconnect();
    };
  })

  const setupWebcam = async () => {
    try {
      console.log('gets here')
      localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
      remoteStream = new MediaStream()

      console.log(localStream)

      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream)

      }) 

      pc.ontrack = (e) => {
        e.streams[0].getTracks().forEach(track=> {
          remoteStream.addTrack(track)
        });
      }
      webcamActive.set(true)


    } catch(e) {
      console.error('Error accessing webcam:', e);
      
    }
  }

  const hangUp = () => {
    webcamActive.set(false)
    
    if (localStream) {
      localStream.getTracks().forEach(track=> {
        track.stop()
      });

      localStream = null
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach(track=> {
        track.stop()
      });
      
      remoteStream = null
    }
  }

  const call = async () => {
    console.log('$callId: ', $callId, 'roomId: ', roomId)
    callService.initiateCall(roomId)
  }

  const answer = async () => {
    console.log('$callId: ', $callId, 'roomId: ', roomId)
    callService.answerCall(roomId)
  }

  function srcObject(node: HTMLNodeElement, stream: MediaStream) {
    node.srcObject = stream;
    return {
      update(newStream: MediaStream) {
        if (node.srcObject != newStream) {
          node.srcObject = newStream;
        }
      }
    }
  }
  
</script>

<div class="card p-4">
  <div class="rounded-lg">
    {#if  $webcamActive }
      <video class="h-96 rounded-lg" bind:this={localVideo} use:srcObject={localStream} autoplay playsinline muted>
        <track kind="captions">
      </video>
    {:else}
      <button on:click={setupWebcam}>Start Webcam</button>
    {/if}
  </div>
  <div class="rounded-lg">
    {#if $webcamActive }
      <video class="h-96 rounded-lg" bind:this={remoteVideo} use:srcObject={remoteStream} autoplay playsinline>
        <track kind="captions">
      </video>
    {/if}
  </div>
</div>

<style>
</style>
