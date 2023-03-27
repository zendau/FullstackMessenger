<template>
  <div
    class="video__container"
    :class="{
      'video__container--admin': isAdmin,
    }"
    @click="toFullScreen"
  >
    <div class="video__info">
      <span class="mute">
        <font-awesome-icon
          v-if="isMuted"
          icon="fa-solid fa-microphone-slash"
        />
        <font-awesome-icon
          v-else
          icon="fa-solid fa-microphone"
        />
      </span>
      <p>{{ userName }}</p>
    </div>
    <div
      v-if="isPauseVideo"
      class="video__placeholder"
    >
      <font-awesome-icon icon="fa-solid fa-video-slash" />
    </div>
    <video ref="media" />
  </div>
</template>

<script>
import { onUpdated, ref, watch } from "vue";

export default {
  props: {
    isAdmin: {
      type: Boolean,
      required: true,
    },
    isMuted: {
      type: Boolean,
      required: true,
    },
    isPauseVideo: {
      type: Boolean,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    peerId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const media = ref(null);
    const placeholder = ref(false);
    const isMainFrame = ref(false);

    onUpdated(() => {
      mutedAudio();
    });

    function mutedAudio() {
      console.log("updated");
      if (isMainFrame.value) {
        media.value.muted = true;
      } else {
        media.value.muted = props.isMuted;
      }
    }

    function muteYourSelf() {
      if (!media.value) return;

      isMainFrame.value = true;
      media.value.muted = true;
    }

    watch(
      () => props.isPauseVideo,
      (newStatus) => {
        if (newStatus) {
          media.value.srcObject.getVideoTracks()[0].enabled = false;
          placeholder.value = true;
        } else {
          media.value.srcObject.getVideoTracks()[0].enabled = true;
          placeholder.value = false;
        }
      }
    );

    function setStream(stream) {
      if (!media.value) return;
      console.log("stream", stream);
      media.value.srcObject = stream;
      media.value.addEventListener("loadedmetadata", () => {
        media.value.play();
      });
    }

    function toFullScreen() {
      if (media.value.requestFullscreen) {
        media.value.requestFullscreen();
      } else if (media.value.mozRequestFullScreen) {
        media.value.mozRequestFullScreen();
      } else if (media.value.webkitRequestFullscreen) {
        media.value.webkitRequestFullscreen();
      } else if (media.value.msRequestFullscreen) {
        media.value.msRequestFullscreen();
      }
    }

    return {
      toFullScreen,
      muteYourSelf,
      isMainFrame,
      mutedAudio,
      setStream,
      placeholder,
      media,
    };
  },
};
</script>

<style lang="scss" scoped>
.video {
  &__container {
    display: block;
    position: relative;
    aspect-ratio: 16/9;
    background-color: var(--color-message);
    border-radius: 3px;
    max-width: 100%;
    top: 50%;
    transform: translateY(-50%);
    box-sizing: border-box;

    &--admin {
      border: 1px solid red;
    }
  }

  &__info {
    position: absolute;
    display: flex;
    bottom: 10px;
    left: 5px;
    color: var(--color-primary);
    z-index: 7;
  }

  &__placeholder {
    position: absolute;
    font-size: 70px;
    color: var(--color-primary);
    background-color: var(--color-message);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 5;

    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

video {
  width: 100%;
  height: 100%;
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
      z-index: 1;
      transform: none;
    }
  }
}
</style>
