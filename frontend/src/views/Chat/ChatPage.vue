<template>
  <chatNavbar />
  <section class="chat__container">
    <chats
      v-if="showChats"
      @openChat="openChatRoom"
      @setLastChatElement="setLastChatElement"
    />
    <contacts v-else @openChat="openChatRoom" />
    <chatContainer />
  </section>
  <UserModal />
</template>

<script>
import { computed, provide, inject, reactive } from "vue";

import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useStore } from "vuex";

import chatNavbar from "../../components/chat/navbar.vue";
import Contacts from "../../components/chat/contacts.vue";
import ChatContainer from "../../components/chat/chatContainer.vue";
import Chats from "../../components/chat/chats.vue";

import UserModal from "../../components/chat/userModal.vue";

import $api from "../../axios";

export default {
  components: { chatNavbar, Contacts, ChatContainer, Chats, UserModal },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const isShowMobileMessages = ref(false);
    provide("isShowMobileMessages", isShowMobileMessages);

    const createGroupUsers = ref([]);
    provide("createGroupUsers", createGroupUsers);
    const chatSocket = inject("chatSocket");

    const chatId = computed(() => route.params.id);
    const userId = computed(() => store.state.auth.user.id);
    const modalUserId = ref(null);
    provide("modalUserId", modalUserId);

    let isFirstChatsLoad = true;

    const showChats = ref(true);
    provide("showChats", showChats);

    const isCallSendAfterCreate = ref(false);
    provide("isCallSendAfterCreate", isCallSendAfterCreate);

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

    const chatObserver = new IntersectionObserver(
      (entries) => {
        console.log("entity test", entries);
        if (entries[0].isIntersecting) {
          console.log("call in observer");
          store.dispatch("chat/getChats", {
            userId: userId.value,
          });
        }
      },
      {
        rootMargin: "100px",
      }
    );

    console.log("call in setup");
    store.dispatch("chat/getChats", {
      userId: userId.value,
      chatId: chatId.value,
    });

    chatSocket.on("newChat", (chatData) => {
      console.log("NEW CHAT", chatData);
      store.commit("chat/saveChat", chatData);
      if (chatData.adminId === userId.value || isCallSendAfterCreate.value) {
        router.push(`/chat/${chatData.id}`);
      }
    });

    chatSocket.on("newMessage", (messagesData) => {
      store.dispatch("chat/newChatMessage", {
        messagesData,
        userId: userId.value,
      });
    });

    chatSocket.on("inviteChatUser", (inseredUserData) => {
      console.log("inseredUserData", inseredUserData);

      if (inseredUserData?.adminId === userId.value) {
        store.commit("chat/updateFreeChatUsers", inseredUserData.userData.id);
      }

      if (inseredUserData.userData.id === userId.value) {
        store.dispatch("chat/getChatMessages", {
          chatId: inseredUserData.inseredData.chatId,
          userId: userId.value,
        });
      } else {
        store.commit("chat/addUserToGroup", {
          chatId: inseredUserData.inseredData.chatId,
          userData: inseredUserData.userData,
        });
      }

      // if (freeUsersList.value.hasOwnProperty(inseredUserData[0].userId)) {
      //   delete freeUsersList.value[inseredUserData[0].userId];
      // }

      // if (!roomsData.value.hasOwnProperty(inseredUserData.inseredData.chatId))
      //   return;
    });

    chatSocket.on("removeChatUser", (removeUser) => {
      console.log("REMOVE", removeUser);
      store.dispatch("chat/deleteFromChat", removeUser);

      if (removeUser?.adminId === userId.value) {
        store.commit("chat/pushFreeChatUsers", removeUser.deletedUserInfo);
      }
    });

    chatSocket.on("deletedChatGroup", (removeData) => {
      if (removeData.chatId === chatId.value) {
        router.push("/chat");
      }

      store.commit("chat/deleteChatData", removeData.chatId);
      store.commit("chat/clearChatMessages", removeData.chatId);
    });

    chatSocket.on("chatSocketError", (errorData) => {
      store.commit("alert/setErrorMessage", errorData.message);
    });

    // chatSocket.on("newChat", (chatData) => {
    //   store.commit("chat/appendChatsData", chatData);
    // });

    //store.commit("chat/cleanChatData");

    function openChatRoom(roomId, isFirstLoad = false) {
      debugger;
      if (!roomId || (chatId.value === roomId && !isFirstLoad)) return;
      console.log("OPEN", roomId);
      router.push(`/chat/${roomId}`);

      if (roomId === "temp") {
        router.push(`/chat`);
        return;
      }
      const roomMessages = store.state.chat.messages[roomId];

      if (roomMessages === undefined || roomMessages?.length === 0) {
        console.log("!2");
        store.dispatch("chat/getChatMessages", {
          chatId: roomId,
          userId: userId.value,
        });
      }
    }

    function setLastChatElement(el) {
      if (!el) return;
      console.log("LAST ELEMENT", el);
      chatObserver.observe(el);
      debugger;
      if (chatId.value && isFirstChatsLoad) {
        isFirstChatsLoad = false;
        console.log("open room", chatId.value);
        openChatRoom(chatId.value, true);
      }
    }

    // chatSocket.on("appendRoomsData", (newRoomsData) => {
    //   loadChatsPagination.hasMore = newRoomsData.hasMore;
    //   loadChatsPagination.page = newRoomsData.page;
    //   console.log("loadChatsPagination", loadChatsPagination);
    //   store.commit("chat/appendChatsData", newRoomsData.roomsData);
    // });

    // chatSocket.on("appendRoomData", (newRoomData) => {
    //   const chatId = newRoomData.chatId;
    //   store.commit("chat/appendChatsData", { [chatId]: newRoomData.data });
    // });

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

    // chatSocket.on("upload_messages", (uploadMessagesData) => {
    //   console.log("messages", uploadMessagesData);

    //   if (!uploadMessagesData) return;
    //   store.commit("chat/saveMessages", {
    //     chatId: chatId.value,
    //     uploadMessagesData,
    //   });
    // });

    return {
      // chatId,
      openChatRoom,
      showChats,
      setLastChatElement,
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
