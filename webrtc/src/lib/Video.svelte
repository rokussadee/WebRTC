<script lang="ts">
  import {pc} from '../firebase';
  import {webcamActive} from '../stores.ts';

  let localStream: MediaStream | null = null;
  let remoteStream: MediaStream | null = null;
  let localVideo: HTMLNodeElement;
  let remoteVideo: HTMLNodeElement;

  let webcamState;

  webcamActive.subscribe((value) => {
    webcamState = value;
    console.log(webcamState, value)
  })


  const setupWebcam = async () => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:false})
      webcamActive.set(true)
      remoteStream = new MediaStream()

      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream)
      }) 

      pc.ontrack = (e) => {
        e.streams[0].getTracks().forEach(track=> {
          remoteStream.addTrack(track)
        });

        remoteVideo.srcObject = remoteStream
      }

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
  
</script>

<div>
  <div>
    {#if  webcamState }
      <video bind:this={localVideo}>
      </video>
    {:else}
      <button on:click={setupWebcam}>Start Webcam</button>
    {/if}
  </div>
  <div>
    {#if webcamState}
      <video bind:this={remoteVideo}>
      </video>
    {/if}
  </div>
  <div>
    {#if webcamState}
      <button on:click={hangUp}>Hang Up</button>
    {/if}
  </div>
</div>

<style>
</style>
