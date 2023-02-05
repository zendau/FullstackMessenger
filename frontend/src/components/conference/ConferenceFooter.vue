<template>
  <footer>
    <div class="conference__menu">
      <div class="menu__setting">
        <button @click="isMuted = !isMuted">
          <i
            class="bi"
            :class="isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'"
          />{{ isMuted ? "Unmute" : "Mute" }}
        </button>
        <button
          v-if="conferenceType"
          @click="isPauseVideo = !isPauseVideo"
        >
          <i
            class="bi"
            :class="isPauseVideo ? 'bi-camera-video-off-fill' : 'bi-camera-video-fill'"
          />{{
            isPauseVideo ? "Off" : "On"
          }}
        </button>
        <button
          v-if="!conferenceType"
          @click="isRecord = !isRecord"
        >
          <i
            class="bi"
            :class="isRecord ? 'bi-stop-circle' : 'bi-record-circle'"
          />{{ isRecord ? "Stop" : "Record" }}
        </button>
        <button
          v-if="conferenceType"
          class="mobile"
          @click="isRecordScreen = !isRecordScreen"
        >
          <i
            class="bi"
            :class="isRecordScreen ? 'bi-stop-circle' : 'bi-record-circle'"
          />{{
            isRecordScreen ? "Stop" : "Record"
          }}
        </button>
        <button
          v-if="conferenceType"
          class="mobile"
          @click="isShareScreen = !isShareScreen"
        >
          <i
            class="bi"
            :class="isShareScreen ? 'bi-tv-fill' : 'bi-tv'"
          />{{ isShareScreen ? "Stop" : "Show" }}
        </button>
      </div>
      <div class="menu__conference-data">
        <h3 class="menu__conference-title">
          {{ conferenceTitle }}
        </h3>
        <p class="menu__conference-admin">
          <span v-if="conferenceType">Group</span>
          <span v-else>Private</span>
        </p>
      </div>
      <div>
        <button
          class="menu__chat"
          @click="$router.push('/conferences')"
        >
          <i class="bi bi-x-circle-fill" />
          Interrupt
        </button>
        <button
          class="menu__chat"
          @click="$emit('show-chat')"
        >
          <i class="bi bi-chat-dots" /> Chat
        </button>
      </div>
    </div>
  </footer>
</template>

<script>
import { inject } from "vue";

export default {
  props: {
    conferenceTitle: {
      type: String,
      required: true,
    },
    conferenceType: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["show-chat"],
  setup() {
    const isRecord = inject("isRecord");
    const isMuted = inject("isMuted");
    const isPauseVideo = inject("isPauseVideo");
    const isShareScreen = inject("isShareScreen");
    const isRecordScreen = inject("isRecordScreen");

    return {
      isMuted,
      isRecord,
      isPauseVideo,
      isShareScreen,
      isRecordScreen,
    };
  },
};
</script>

<style lang="scss" scoped>
footer {
  height: 60px;
  background-color: var(--bgcColor);
  box-sizing: border-box;
}

.menu {
  &__setting button,
  &__chat {
    width: 50px;
    height: 50px;
    border: none;
    background-color: inherit;
    color: var(--textColor);
    cursor: pointer;
    transition: 0.3s ease;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:hover {
      color: var(--activeColor);
    }

    i {
      font-size: 24px;
    }

    font-size: 14px;
  }

  &__conference-title {
    color: var(--textColor);
  }

  &__conference-admin {
    color: var(--secondTextColor);
  }

  &__conference-title,
  &__conference-admin {
    text-align: center;
  }

  &__chat {
    width: 50px;
    height: 50px;

    i {
      font-size: 24px;
    }

    font-size: 14px;
  }
}

@media (max-width: 1140px) {
  .mobile {
    display: none !important;
  }
}
</style>
