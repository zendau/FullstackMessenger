<template>
  <ChatNavbar />
  <section class="chat__container">
    <Chats
      v-if="showChats"
      @open-chat="openChatRoom"
      @set-last-chat-element="setLastChatElement"
    />
    <Contacts
      v-else
      @open-chat="openChatRoom"
    />
    <ChatContainer />
  </section>
  <UserModal />
</template>

<script>
import { computed, provide, inject, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import ChatNavbar from "@/components/chat/Navbar.vue";
import Contacts from "@/components/chat/Contacts.vue";
import ChatContainer from "@/components/chat/ChatContainer.vue";
import Chats from "@/components/chat/Chats.vue";
import UserModal from "@/components/chat/UserModal.vue";

export default {
  components: { ChatNavbar, Contacts, ChatContainer, Chats, UserModal },
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

    onMounted(() => {
      window.addEventListener("keyup", closeActiveChat);
    });

    onUnmounted(() => {
      window.removeEventListener("keyup", closeActiveChat);
    });

    const chatObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          store.dispatch("chat/getChats", {
            userId: userId.value,
          });
        }
      },
      {
        rootMargin: "100px",
      }
    );

    store.dispatch("chat/getChats", {
      userId: userId.value,
      chatId: chatId.value,
    });

    chatSocket.on("newChat", (chatData) => {
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
    });

    chatSocket.on("removeChatUser", (removeUser) => {
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

    function openChatRoom(roomId, isFirstLoad = false) {
      if (!roomId || (chatId.value === roomId && !isFirstLoad)) return;
      router.push(`/chat/${roomId}`);

      if (roomId === "contact") {
        router.push(`/chat`);
        return;
      }

      const chatData = store.state.chat.chats.get(roomId);
      const paginationPage = chatData?.loadMessagesPagination?.page;

      if (!paginationPage) {
        store.commit("chat/clearChatMessages", roomId);
        store.dispatch("chat/getChatMessages", {
          chatId: roomId,
          userId: userId.value,
        });
      }
    }

    function setLastChatElement(el) {
      if (!el) return;
      chatObserver.observe(el);
      if (chatId.value && isFirstChatsLoad) {
        isFirstChatsLoad = false;
        openChatRoom(chatId.value, true);
      }
    }

    function closeActiveChat() {
      router.push("/chat");
    }

    return {
      showChats,
      openChatRoom,
      setLastChatElement,
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
