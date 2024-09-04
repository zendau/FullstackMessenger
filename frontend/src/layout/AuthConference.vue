<template>
  <section class="main-container">
    <AlertNotification />
    <div
      v-if="roomData && !alert.text"
      class="conference-container"
      :class="{
        'conference-container--audio': roomData.conferenceWithVideo === 0,
      }"
    >
      <router-view />
    </div>
    <div
      v-show="showChat"
      class="conference-chat"
    >
      <ConferenceChat />
      <!-- <ConferenceChat :room-id="roomData.chatId" /> -->
    </div>
  </section>
  <FooterComponent
    v-if="roomData"
    :conference-title="roomData.title"
    :conference-type="roomData.conferenceWithVideo"
    :is-private="!!roomData.adminId"
    @show-chat="showChat = !showChat"
  />
</template>

<script>
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  onBeforeUpdate,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import AlertNotification from "@/components/UI/AlertNotification.vue";
import FooterComponent from "@/components/conference/ConferenceFooter.vue";
import ConferenceChat from "@/components/conference/ConferenceChat.vue";
import { useEventListener } from "@/composables/useEventListener";
import { usePeerConference } from "@/composables/conference/usePeerConference";
import { useMediaDevices } from "@/composables/conference/useMediaDevices";

// import ChatContainer from "@/components/chat/ChatContainer.vue";

export default {
  components: { FooterComponent, AlertNotification, ConferenceChat },
  setup() {
    const showChat = ref(false);
    const store = useStore();
    const route = useRoute();
    const alert = computed(() => store.state.alert);

    const roomId = route.params.id;
    const roomData = computed(() => store.getters["chat/selectedChat"](roomId));

    provide("roomData", roomData);

    const userId = store.state.auth.user.id;

    if (!roomData.value) {
      store.dispatch("chat/getChatById", {
        userId,
        chatId: roomId,
      });
    }

    const isMuted = ref(false);
    provide("isMuted", isMuted);

    const isRecord = ref(false);
    provide("isRecord", isRecord);

    const isPauseVideo = ref(false);
    provide("isPauseVideo", isPauseVideo);

    const isShareScreen = ref(false);
    provide("isShareScreen", isShareScreen);

    const isRecordScreen = ref(false);
    provide("isRecordScreen", isRecordScreen);

    const isConferenceAdmin = inject("isConferenceAdmin");
    const peerSocket = inject("peerSocket");

    onMounted(() => {
      // store.dispatch("conference/getConferenceData", roomId);
      document.querySelector("#app").classList.add("conference-grid");
    });

    onUnmounted(() => {
      if (isConferenceAdmin?.value) {
        isConferenceAdmin.value = false;
      }

      document.querySelector("#app").classList.remove("conference-grid");
    });

    const isVideoConference = route.name === "videoRoom";

    /////////

    const {
      connectToNewUser,
      peerConnected,
      peerId,
      childStream,
      containersRefs,
      initPeerListeners,
    } = usePeerConference();

    initPeerListeners(isVideoConference);
    const socketConnected = inject("peerSocketConnected", false);
    const roomUsers = ref([]);
    provide("roomUsers", roomUsers);

    const userData = computed(() => store.state.auth.user);

    const isReadyToJoin = computed(
      () => socketConnected.value && peerConnected.value
    );

    const localeStream = ref(null);
    provide("localeStream", localeStream);

    watch(
      isReadyToJoin,
      async (ready) => {
        if (ready) {
          const { stream } = await useMediaDevices(isVideoConference);
          localeStream.value = stream;

          peerSocket.emit("join-room", {
            userId: userData.value.id,
            userLogin: userData.value.login,
            peerId: peerId.value,
            roomId,
          });
        }
      },
      {
        immediate: true,
      }
    );

    // Change muted status
    watch(isMuted, () => {
      peerSocket.emit("userMute", {
        userId: userData.value.id,
        roomId,
      });
    });

    // Exit from room and clear data
    onUnmounted(() => {
      peerSocket.emit("exit-room", {
        userId: userData.value.id,
        roomId,
      });
      peerSocket.removeAllListeners("getUsers");
      localeStream.value?.getTracks().forEach((t) => {
        t.stop();
      });
      childStream?.forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      });
    });

    onBeforeUpdate(() => {
      containersRefs.length = 0;
    });

    peerSocket.on("getUsers", (users) => {
      roomUsers.value = new Map(JSON.parse(users));
    });

    peerSocket.on("userJoinedRoom", (userId) => {
      connectToNewUser(userId, localeStream.value);
    });

    useEventListener("keypress", muteEvent);

    function muteEvent(event) {
      if (event.code === "KeyM") {
        isMuted.value = !isMuted.value;
      }
    }

    return { alert, showChat, roomData, isMuted };
  },
};
</script>

<style>
.conference-grid {
  display: grid;
  grid-template-rows: 50px 1fr 60px;
  height: 100vh;
  max-height: 100vh;
}

@media (max-width: 960px) {
  .conference-grid {
    grid-template-rows: 1fr 60px;
  }
}
</style>

<style lang="scss">
.main-container {
  overflow: hidden;
  display: flex;
  background-color: var(--color-background-secondary);
}

.conference {
  &-container {
    padding: 5px;
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
    overflow-y: scroll;
    justify-items: center;
    &--audio {
      grid-template-rows: repeat(auto-fit, 50px);
      align-content: center;
      grid-template-columns: repeat(auto-fit, 300px);
      justify-content: center;
      grid-auto-flow: column;
    }

    &--hide {
      display: none;
    }
  }

  &-chat {
    display: flex;
    flex-direction: column;
    width: 400px;
    background-color: var(--color-message);

    &--active {
      width: 100%;
      position: absolute;
      z-index: 2;
      background-color: var(--color-primary);
      height: 100%;
    }
  }

  &__menu {
    display: flex;
    height: 100%;
    width: 800px;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
  }
}

@media (max-width: 1140px) {
  .conference {
    &-container {
      overflow-x: hidden;
    }
  }
}

@media (max-width: 960px) {
  .menu {
    &__conference-data {
      margin: 0 10px;
    }
  }

  .main-container {
    max-height: 100vh;
    position: relative;
  }

  .conference {
    &__menu {
      width: 600px;
      margin: 0 auto;
      justify-content: center;
    }

    &__navbar {
      z-index: 2;
      height: auto !important;
      width: 100%;
      position: absolute;
    }
  }
}

@media (max-width: 730px) {
  .conference {
    &__menu {
      width: 380px;
      margin: 0 auto;
    }
  }
}
</style>
