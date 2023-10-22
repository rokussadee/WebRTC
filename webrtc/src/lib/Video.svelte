<script lang="ts">
  import {pc} from '../firebase';
  import {callService} from '../services/callService.ts';
  import {webcamActive, callId} from '../stores.ts';

  let localStream: MediaStream | null = null;
  let remoteStream: MediaStream | null = null;
  let localVideo: HTMLNodeElement;
  let remoteVideo: HTMLNodeElement;

  let webcamState: boolean;
  let currentCallId: string;

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
    callService.initiateCall()
  }

  const answer = async () => {
    callService.answerCall($callId)
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

<div>
  <div>
    {#if  $webcamActive }
      video should be rendered
      <video bind:this={localVideo} use:srcObject={localStream} autoplay playsinline>
        <track kind="captions">
      </video>
      <button on:click={call}>Call</button>
    {:else}
      <button on:click={setupWebcam}>Start Webcam</button>
    {/if}
  </div>
  <div>
    {#if $webcamActive }
      <video bind:this={remoteVideo} use:srcObject={remoteStream} autoplay playsinline>
        <track kind="captions">
      </video>
    {/if}
  </div>
  <div>
    {#if $webcamActive }
      <button on:click={hangUp}>Hang Up</button>
    {/if}
  </div>
  <div>
    <input type="text" bind:value={$callId}/>
    <button on:click={answer}>Answer Call</button>
  </div>
</div>

<style>
</style>
