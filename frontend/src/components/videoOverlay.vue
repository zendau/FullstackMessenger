<template>
  <div class="video-container">
      <div v-if='pause' class="overlay">No signal</div>
      <video ref="videoRef" :id='id' :srcObject='srcObject' autoplay="autoplay" :muted='muted'></video>
      <slot/>
  </div>
</template>

<script>
import { ref, onUpdated } from 'vue'
export default {
  props: ['srcObject', 'id', 'muted', 'pause'],
  setup(props) {
    
    const videoRef = ref(null)

    onUpdated(() => {
      console.log("UPDATED")
      
      if (props.pause) {
        videoRef.value.pause() 
      } else {
        videoRef.value.play()
      }

      
    })

    return {
      videoRef
    }

  }
  
}
</script>

<style>
  .overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 30px;
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: black;
  }

  .video-container {
    width: 500px;
    height: auto;
    position: relative;
    margin: 20px;
  }

  video {
    width: 100%;
    height: 100%;
  }

</style>