<template>
  <section class="main-container">
    <AlertNotification v-if="mediaError" />
    <div
      v-else
      class="conference-container"
      :class="{ 'conference-container--audio': !roomData.type }"
    >
      <router-view />
    </div>
    <div
      v-if="showChat"
      class="conference-chat"
    >
      <ConferenceChat :room-id="roomData.chatId" />
    </div>
  </section>
  <FooterComponent
    :conference-title="roomData.title"
    :conference-admin="roomData.adminLogin"
    @show-chat="showChat = !showChat"
  />
</template>

<script>
import { computed, inject, onMounted, onUnmounted, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import AlertNotification from "@/components/UI/AlertNotification.vue";
import FooterComponent from "@/components/conterence/footer.vue";
import ConferenceChat from "@/components/conterence/chat/chat.vue";
export default {
  components: { FooterComponent, ConferenceChat, AlertNotification },
  setup() {
    const showChat = ref(false);
    const store = useStore();

    const mediaError = ref(false);
    provide("mediaError", mediaError);
    const roomData = computed(() => store.state.conference);

    const route = useRoute();
    const router = useRouter();
    const roomId = route.params.id;

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
    const socket = inject("socket");

    onMounted(async () => {
      store.dispatch("conference/getConferenceData", roomId);
      document.querySelector("#app").classList.add("conference-grid");
    });

    onUnmounted(() => {
      isConferenceAdmin.value = false;
      document.querySelector("#app").classList.remove("conference-grid");
    });

    watch(
      () => store.state.conference.adminId,
      (adminId) => {
        if (adminId === store.state.auth.user.id) {
          isConferenceAdmin.value = true;
        }
        const userId = store.state.auth.user.id;

        const { chatId } = store.state.conference;

        if (chatId) {
          store.dispatch("chat/invaiteUserToChat", {
            userId,
            chatId,
          });
        }
      },
      {
        immediate: true,
      }
    );

    socket.on("redirectUsers", () => {
      store.dispatch("conference/getConferesRooms");
      router.push("/conferences");
    });

    return {
      showChat,
      roomData,
      isMuted,
      mediaError,
    };
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
  background-color: var(--menuColor);
}

.conference {
  &-container {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
    overflow-y: auto;
    justify-items: center;
    margin: 3px;

    &--audio {
      grid-template-rows: repeat(auto-fit, 50px);
      align-content: center;
      grid-template-columns: repeat(auto-fit, 300px);
      justify-content: center;
      grid-auto-flow: column;
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #3f4750;
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9b9fa4;
      box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
      border-radius: 10px;
    }

    &--hide {
      display: none;
    }
  }

  &-chat {
    display: flex;
    flex-direction: column;
    width: 350px;
    background-color: var(--messageColor);

    &--active {
      width: 100%;
      position: absolute;
      z-index: 2;
      background-color: white;
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

.chat {
  &__body {
    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #3f4750;
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9b9fa4;
      box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
      border-radius: 10px;
    }
  }
}

@media (max-width: 1140px) {
}

@media (max-width: 960px) {
  .main-container {
    max-height: 100vh;
    position: relative;
  }

  .conference {
    &__menu {
      width: 600px;
      margin: 0 auto;
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
