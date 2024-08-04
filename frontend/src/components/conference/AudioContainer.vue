<template>
  <div class="audio__container">
    <div class="audio__info">
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
    <audio ref="media" />
  </div>
</template>

<script>
import { onUpdated, ref } from "vue";

export default {
  props: {
    userName: {
      type: String,
      required: true,
    },
    isMuted: {
      type: Boolean,
      required: true,
    },
    peerId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const media = ref(null);

    onUpdated(() => {
      mutedAudio();
    });

    function mutedAudio() {
      media.value.muted = props.isMuted;
    }

    function setStream(stream) {
      media.value.srcObject = stream;
      media.value.addEventListener("loadedmetadata", () => {
        media.value.play();
      });
    }

    return {
      media,
      mutedAudio,
      setStream,
    };
  },
};
</script>

<style lang="scss" scoped>
.audio {
  &__container {
    background-color: var(--color-message);
    width: 250px;
    height: 40px;
    align-self: center;
  }

  &__info {
    display: flex;
    height: 40px;
    align-items: center;
    color: var(--color-primary);

    .mute {
      border-right: 1px solid black;
      height: 40px;
      width: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 18px;
    }

    p {
      text-align: center;
      padding: 15px;
      justify-self: center;
    }

    &--active {
      border: 2px solid var(--color-links-active);

      .mute {
        border-right: 2px solid var(--color-links-active);
      }
    }

    &--admin {
      border: 2px solid var(--dangerColor);

      .mute {
        border-right: 2px solid var(--dangerColor);
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
