<template>
  <footer>
    <div class="conference__menu">
      <div class="menu__setting">
        <button @click="isMuted = !isMuted">
          <font-awesome-icon
            v-if="isMuted"
            icon="fa-solid fa-microphone-slash"
          />
          <font-awesome-icon
            v-else
            icon="fa-solid fa-microphone"
          />
          {{ isMuted ? $t("conference.conferenceFoouter.off") : $t("conference.conferenceFoouter.on") }}
        </button>
        <button
          v-if="conferenceType"
          @click="isPauseVideo = !isPauseVideo"
        >
          <font-awesome-icon
            v-if="isPauseVideo"
            icon="fa-solid fa-video-slash"
          />
          <font-awesome-icon
            v-else
            icon="fa-solid fa-video"
          />
          {{ isPauseVideo ? $t("conference.conferenceFoouter.off") : $t("conference.conferenceFoouter.on") }}
        </button>
        <button
          v-if="!conferenceType"
          @click="isRecord = !isRecord"
        >
          <font-awesome-icon
            v-if="isRecord"
            icon="fa-solid fa-circle-stop"
          />
          <font-awesome-icon
            v-else
            icon="fa-solid fa-record-vinyl"
          />
          {{ isRecord ? $t("conference.conferenceFoouter.stop") : $t("conference.conferenceFoouter.record") }}
        </button>
        <button
          v-if="conferenceType"
          class="mobile"
          @click="isRecordScreen = !isRecordScreen"
        >
          <font-awesome-icon
            v-if="isRecordScreen"
            icon="fa-solid fa-circle-stop"
          />
          <font-awesome-icon
            v-else
            icon="fa-solid fa-record-vinyl"
          />
          {{ isRecordScreen ? $t("conference.conferenceFoouter.stop") : $t("conference.conferenceFoouter.record") }}
        </button>
        <button
          v-if="conferenceType"
          class="mobile"
          @click="isShareScreen = !isShareScreen"
        >
          <font-awesome-icon
            v-if="isShareScreen"
            icon="fa-solid fa-circle-stop"
          />
          <font-awesome-icon
            v-else
            icon="fa-solid fa-display"
          />
          {{ isShareScreen ? $t("conference.conferenceFoouter.stop") : $t("conference.conferenceFoouter.show") }}
        </button>
      </div>
      <div class="menu__conference-data">
        <h3 class="menu__conference-title">
          {{ conferenceTitle }}
        </h3>
        <p class="menu__conference-admin">
          <span
            v-if="isPrivate"
            class="menu__conference-admin--group"
            @click="toggleUsersList"
          >
            {{ $t("conference.conferenceFoouter.group") }}
          </span>
          <span v-else>{{ $t("conference.conferenceFoouter.private") }}</span>
        </p>
      </div>
      <div>
        <button
          class="menu__chat"
          @click="$router.push('/conferences')"
        >
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
          {{ $t("conference.conferenceFoouter.interrupt") }}
        </button>
        <button
          class="menu__chat"
          @click="$emit('show-chat')"
        >
          <font-awesome-icon icon="fa-solid fa-comment-dots" /> {{ $t("conference.conferenceFoouter.chat") }}
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
      type: Boolean,
      required: true,
    },
    isPrivate: {
      type: Boolean,
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
  background-color: var(--color-background);
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
    color: var(--color-primary);
    cursor: pointer;
    transition: 0.3s ease;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 5px;

    &:hover {
      color: var(--color-links-active);
    }

    svg {
      font-size: 24px;
    }

    font-size: 14px;
  }

  &__conference-title {
    color: var(--color-primary);
  }

  &__conference-admin {
    color: var(--color-secondary);

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

@media (max-width: 900px) {
  .mobile {
    display: none !important;
  }
}
</style>
