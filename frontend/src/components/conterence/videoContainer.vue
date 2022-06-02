<template>
  <div class="video__container" :class="{
    'video__container--active': isActive,
    'video__container--admin': isAdmin
  }">
    <div class="video__info">
      <span class="mute">
        <i class="bi" :class="isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'" />
      </span>
      <p>{{ userName }}</p>
    </div>
    <div v-if="isOffVideo" class="video__placeholder">
      <i class="bi bi-camera-video-off" />
    </div>
    <video ref="media"></video>
  </div>
</template>

<script>
import { onUpdated, ref } from 'vue'


export default {
  props: ['isActive', 'isAdmin', 'isMuted', 'isOffVideo', 'userName', 'peerId'],
  setup(props) {

    const media = ref(null)

    onUpdated(() => {
      mutedAudio()
    })

    function mutedAudio() {
      media.value.muted = props.isMuted
    }

    function setStream(stream) {
      media.value.srcObject = stream
      console.log('stream', stream)
      media.value.addEventListener('loadedmetadata', () => {
        media.value.play()
      })
    }

    return {
      media,
      mutedAudio,
      setStream
    }

  }
}

</script>

<style lang="scss" scoped>
.video {
  &__container {
    display: block;
    position: relative;
    aspect-ratio: 16/9;
    background-color: $messageColor;
    border-radius: 3px;
    max-width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  &__info {
    position: absolute;
    display: flex;
    bottom: 10px;
    left: 5px;
    color: $textColor;
    z-index: 3;
  }

  &__placeholder {
    position: absolute;
    font-size: 70px;
    color: $textColor;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

video {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
}

/* video::before {
    float: left;
    padding-top: 56.25%;
    content: '';
}

video::after {
    display: block;
    content: '';
    clear: both;
} */

@media (max-width: 730px) {

  .video {
    &__container {
      margin-bottom: 5px;
      top: 0;
      transform: none;
    }
  }
}
</style>