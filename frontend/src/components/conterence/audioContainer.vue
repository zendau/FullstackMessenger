<template>
  <div class="audio__container">
    <div class="audio__info">
      <span class="mute">
        <i class="bi" :class="isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'" />
      </span>
      <p>{{ userName }}</p>
    </div>
    <audio ref="media"></audio>
  </div>
</template>

<script>
import { onUpdated, ref } from 'vue'


export default {
  props: ['isActive', 'isAdmin', 'isMuted', 'userName', 'peerId'],
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
      console.log(stream, 'stream')
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
.audio {

  &__container {
    background-color: $messageColor;
  }

  &__info {
    display: flex;
    height: 30px;
    align-items: center;
    color: $textColor;

    .mute {
      border-right: 1px solid black;
      height: 30px;
      width: 30px;
      text-align: center;
      line-height: 30px;
      font-size: 18px;
    }

    p {
      text-align: center;
      padding: 15px;
    }

    &--active {
      border: 2px solid $activeColor;

      .mute {
        border-right: 2px solid $activeColor;
      }
    }

    &--admin {
      border: 2px solid $dangerColor;

      .mute {
        border-right: 2px solid $dangerColor;
      }
    }
  }

}

@media (max-width: 730px) {

  .audio {
    &__container {
      margin-bottom: 10px;
    }
  }
}
</style>