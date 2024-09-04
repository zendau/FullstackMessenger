<template>
  <component :is="authLayout">
    <slot />
    <ConferenceCall />
  </component>
</template>

<script>
import {
  computed,
  provide,
  ref,
  onUnmounted,
  onUpdated,
  inject,
  onMounted,
  watch,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ConferenceCall from "@/components/conference/ConfrenceCall.vue";
import { Layout } from "@/router/layouts";
import AuthChatLayoutVue from "./AuthChatLayout.vue";
import AuthMainLayoutVue from "./AuthMainLayout.vue";

export default {
  components: { ConferenceCall },
  setup() {
    const store = useStore();
    const route = useRoute();

    onMounted(() => {
      if (!chatSocket.connected && !peerSocket.connected) {
        console.log("chatSocket.connect();");
        peerSocket.connect();
        chatSocket.connect();
      }
    });

    onUnmounted(() => {
      if (!authStatus.value) {
        console.log("chatSocket.disconnect();");
        chatSocket.disconnect();
        peerSocket.disconnect();
        isChatSocketConntect.value = false;
        isPeerSocketConntect.value = false;
      }
    });

    onUpdated(() => {
      console.log("authStatus", authStatus.value);
    });

    const isChatSocketConntect = ref(false);
    const isPeerSocketConntect = ref(false);

    const userId = computed(() => store.state.auth.user.id);
    const authStatus = computed(() => store.state.auth.authStatus);

    const authLayout = computed(() => {
      console.log("CHANGE AUTH STATUS", authStatus.value);

      if (route.meta.layout === Layout.Chat) return AuthChatLayoutVue;
      else if (route.meta.layout === Layout.Main) return AuthMainLayoutVue;
      else if (route.fullPath === "/") return null;
      else {
        console.error("set route meta layout", route.fullPath);
        return null;
      }
    });

    const chatSocket = inject("chatSocket");
    const peerSocket = inject("peerSocket");

    const peerSocketConnected = ref(false);
    provide("peerSocketConnected", peerSocketConnected);

    watch(
      [isPeerSocketConntect, isChatSocketConntect],
      ([peerStatus, socketStatus]) => {
        if (peerStatus && socketStatus) {
          const peerId = peerSocket.id;

          store.state.auth.user.peerId = peerId;

          peerSocket.emit("connect-user", userId.value);
          peerSocketConnected.value = true;
          console.log(
            "=====================peerSocketConnected",
            peerSocketConnected.value
          );

          chatSocket.emit("connect-user", {
            userId: userId.value,
            peerId,
          });
        }
      },
      {
        immediate: true,
      }
    );

    peerSocket.on("connect", () => {
      isPeerSocketConntect.value = true;
    });

    chatSocket.on("connect", () => {
      isChatSocketConntect.value = true;

      // console.log("CONNETECT SOCKET");
      // const peerId = await peerIdPromise;
      // store.state.auth.user.peerId = peerId;

      // chatSocket.emit("connect-user", {
      //   userId: userId.value,
      //   peerId,
      // });
    });

    chatSocket.on("updateUserOnline", (userStatus) => {
      console.log("userStatus", userStatus);
      store.commit("users/updateUserOnline", userStatus);
    });

    chatSocket.on("changeContactStatus", (data) => {
      console.log("data", data);
      store.commit("contact/changeContactStatus", data);
    });

    setInterval(() => store.commit("users/updateUsersDateOnline"), 30000);

    return {
      authLayout,
    };
  },
};
</script>
