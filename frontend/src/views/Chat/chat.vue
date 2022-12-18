<template>
  <chatNavbar />
  <section class="chat__container">
    <chats v-if="showContacts" />
    <contacts v-else />
    <messages />
  </section>
</template>

<script>
import { computed, onUnmounted, provide } from "vue";

import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useStore } from "vuex";

import chatNavbar from "../../components/chat/navbar.vue";
import Contacts from "../../components/chat/contacts.vue";
import Messages from "../../components/chat/messages.vue";
import Chats from "../../components/chat/chats.vue";

import { io } from "socket.io-client";
import $api from "../../axios";

export default {
  components: { chatNavbar, Contacts, Messages, Chats },
  setup() {
    console.log('chat setup')
    const route = useRoute();
    const router = useRouter();

    const isShowMobileMessages = ref(false)
    provide('isShowMobileMessages', isShowMobileMessages)

    const chatId = computed(() => route.params.id);

    const showContacts = ref(true);

    provide("showContacts", showContacts);

    const store = useStore();
    const userData = computed(() => store.state.auth.user);

    const socket = io(import.meta.env.VUE_APP_SOCKET_HOST, { path: '/socketChat'});
    provide("socket", socket);

    const socketConnected = ref(false);
    provide("connected", socketConnected);
    socket.on("connect", () => {
      console.log("connected gateway");
      socketConnected.value = true;
      socket.emit("connect-user", {
        userLogin: userData.value.email,
        userId: socket.id,
      });
    });

    store.commit('chat/cleanChatData')

    function enterToChat(roomId) {
      store.commit('chat/cleanMessages')
      if (!roomId) return;

      checkRoom(roomId);
    }

    async function checkRoom(roomId) {
      const res = await $api.get(`/chat/checkId/${roomId}`);
      if (res.data.status === false) {
        router.push("/chat");
      }
      if (res.data.groupName === null) {
        store.commit("chat/setChatTitle", {
          users: res.data.users,
          userId: userData.value.id
        })
      } else {
        store.commit("chat/setGroupData", {
          users: res.data.users,
          title: res.data.groupName,
          adminId: res.data.adminId
        })
        store.dispatch('chat/getInvaitedUsers')
      }

      console.log("join to the room");
      socket.emit("join-room", {
        userId: socket.id,
        roomId,
      });
    }

    onUnmounted(() => {
      store.commit('chat/cleanAllData')
    })

    watch(
      () => route.params.id,
      (value) => {
        if (value) {
          enterToChat(value)
        }
      },
      { immediate: true }
    );

    return {
      chatId,
      showContacts,
      Chats,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat__container {
  display: grid;
  grid-template-columns: 250px 1fr;
}

.btn {
  &--chat {
    background-color: var(--btnChat);
    border: none;
    color: var(--textColor);
    border-radius: 2px;
    padding: 5px 9px;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
      background-color: var(--btnHover);
    }
  }
}

@media (max-width: 720px) {
  .chat {

    &__container {
      grid-template-columns: 1fr;
    }

    &__contacts {
      display: none;

      &--active {
        display: flex;
      }
    }

    &__messages {
      display: none;

      &--active {
        display: grid;
      }
    }
  }
}
</style>