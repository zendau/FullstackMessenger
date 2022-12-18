<template>
  <chatNavbar />
  <section class="chat__container">
    <chats v-if="showChats" @openChat="openChatRoom" />
    <contacts v-else />
    <chatContainer />
  </section>
</template>

<script>
import { computed, onUnmounted, provide, inject } from "vue";

import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useStore } from "vuex";

import chatNavbar from "../../components/chat/navbar.vue";
import Contacts from "../../components/chat/contacts.vue";
import ChatContainer from "../../components/chat/chatContainer.vue";
import Chats from "../../components/chat/chats.vue";

import $api from "../../axios";

export default {
  components: { chatNavbar, Contacts, ChatContainer, Chats },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const isShowMobileMessages = ref(false);
    provide("isShowMobileMessages", isShowMobileMessages);

    const chatSocket = inject("chatSocket");

    const chatId = computed(() => route.params.id);
    const userId = computed(() => store.state.auth.user.id);

    const showChats = ref(true);
    provide("showChats", showChats);

    const userData = computed(() => store.state.auth.user);

    const currentTempChatData = ref(null);

    const loadChatsPagination = {
      page: 0,
      limit: 6,
      hasMore: true,
      inMemory: true,
    };

    const defoultLoadMessagesPagination = {
      page: 0,
      limit: 10,
      hasMore: true,
      inMemory: true,
    };

    // const socket = io(import.meta.env.VITE_SOCKET_HOST, { path: '/socketChat'});
    // provide("socket", socket);

    // const socketConnected = ref(false);
    // provide("connected", socketConnected);
    // socket.on("connect", () => {
    //   console.log("connected gateway");
    //   socketConnected.value = true;
    //   socket.emit("connect-user", {
    //     userLogin: userData.value.email,
    //     userId: socket.id,
    //   });
    // });

    chatSocket.emit("get-chats", {
      userId: userId.value,
      page: loadChatsPagination.page,
      limit: loadChatsPagination.limit,
      chatId: chatId.value,
    });

    chatSocket.on("getRoomsData", (data) => {
      //loadChatsPagination.limit = data.limit;
      console.log("ROOMS DATA", data);
      currentTempChatData.value = data.currentTempChatData;

      loadChatsPagination.page = data.page;
      loadChatsPagination.hasMore = data.hasMore;
      loadChatsPagination.inMemory = data.inMemory;

      store.commit("chat/saveChats", data.roomsData);
      console.log("#######3", chatId.value);
      if (chatId.value) {
        console.log("open room", chatId.value);
        openChatRoom(chatId.value);
      }
    });

    //store.commit("chat/cleanChatData");

    function openChatRoom(roomId) {
      if (chatId.value === roomId) return;
      console.log("OPEN", roomId);
      router.push(`/chat/${roomId}`);

      const roomMessages = store.state.chat.messages[roomId];
      const roomData = store.state.chat.chats[roomId];

      if (roomMessages === undefined || roomMessages?.length === 0) {
        const messagePagination =
          roomData.loadMessagesPagination ?? defoultLoadMessagesPagination;
        chatSocket.emit("getRoomMessages", {
          chatId: roomId,
          page: messagePagination.page,
          limit: messagePagination.limit,
          inMemory: messagePagination.inMemory,
        });
      }
    }

    // if (
    //   !roomMessages.hasOwnProperty(chatId.value) ||
    //   roomMessages[chatId.value]?.length === 0
    // ) {
    //   const messagePagination =
    //     roomsData.loadMessagesPagination ?? defoultLoadMessagesPagination;

    //   socket.emit("getRoomMessages", {
    //     chatId: roomId,
    //     page: messagePagination.page,
    //     limit: messagePagination.limit,
    //     inMemory: messagePagination.inMemory,
    //   });
    // }

    // function enterToChat(roomId) {
    //   store.commit("chat/cleanMessages");
    //   if (!roomId) return;

    //   checkRoom(roomId);
    // }

    // async function checkRoom(roomId) {
    //   const res = await $api.get(`/chat/checkId/${roomId}`);
    //   if (res.data.status === false) {
    //     router.push("/chat");
    //   }
    //   if (res.data.groupName === null) {
    //     store.commit("chat/setChatTitle", {
    //       users: res.data.users,
    //       userId: userData.value.id,
    //     });
    //   } else {
    //     store.commit("chat/setGroupData", {
    //       users: res.data.users,
    //       title: res.data.groupName,
    //       adminId: res.data.adminId,
    //     });
    //     store.dispatch("chat/getInvaitedUsers");
    //   }

    //   console.log("join to the room");
    //   chatSocket.emit("join-room", {
    //     userId: chatSocket.id,
    //     roomId,
    //   });
    // }

    // onUnmounted(() => {
    //   store.commit("chat/cleanAllData");
    // });

    // watch(
    //   () => route.params.id,
    //   (value) => {
    //     if (value) {
    //       enterToChat(value);
    //     }
    //   },
    //   { immediate: true }
    // );

    chatSocket.on("upload_messages", (uploadMessagesData) => {
      console.log("messages", uploadMessagesData);

      if (!uploadMessagesData) return;
      store.commit("chat/saveMessages", {
        chatId: chatId.value,
        uploadMessagesData,
      });
    });

    return {
      // chatId,
      openChatRoom,
      showChats,
      // Chats,
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
