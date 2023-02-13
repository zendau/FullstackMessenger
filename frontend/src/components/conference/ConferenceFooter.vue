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
          <span
            v-if="conferenceType"
            class="menu__conference-admin--group"
            @click="toggleUsersList"
          >
            {{ $t("conference.conferenceFoouter.group") }}</span>
          <span v-else>{{ $t("conference.conferenceFoouter.private") }}</span>
        </p>
      </div>
      <div>
        <button
          class="menu__chat"
          @click="$router.push('/conferences')"
        >
          <i class="bi bi-x-circle-fill" />
          {{ $t("conference.conferenceFoouter.interrupt") }}
        </button>
        <button
          class="menu__chat"
          @click="$emit('show-chat')"
        >
          <i class="bi bi-chat-dots" /> {{ $t("conference.conferenceFoouter.chat") }}
        </button>
      </div>
    </div>
    <HeaderGroupList
      v-if="isShowUsersList"
      :chat-data="roomData"
      :user-id="userId"
    />
  </footer>
</template>

<script>
import { inject, ref } from "vue";
import { useStore } from "vuex";

import HeaderGroupList from "@/components/chat/chatHeader/headerGroupList/HeaderGroupList.vue";
export default {
  components: { HeaderGroupList },
  props: {
    conferenceTitle: {
      type: String,
      required: true,
    },
    conferenceType: {
      type: Number,
      required: true,
    },
  },
  emits: ["show-chat"],
  setup() {
    const store = useStore();

    const roomData = inject("roomData");
    const userId = store.state.auth.user.id;

    const isRecord = inject("isRecord");
    const isMuted = inject("isMuted");
    const isPauseVideo = inject("isPauseVideo");
    const isShareScreen = inject("isShareScreen");
    const isRecordScreen = inject("isRecordScreen");

    const isShowUsersList = ref(false);

    function toggleUsersList() {
      isShowUsersList.value = !isShowUsersList.value;
    }

    return {
      toggleUsersList,
      isShowUsersList,
      isMuted,
      isRecord,
      isPauseVideo,
      isShareScreen,
      isRecordScreen,
      roomData,
      userId,
    };
  },
};
</script>

<style lang="scss" scoped>
footer {
  height: 60px;
  background-color: var(--bgcColor);
  box-sizing: border-box;

  .chat-group__container {
    position: absolute;
    bottom: 60px;
  }
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

    &--group {
      user-select: none;
      cursor: pointer;
    }
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
