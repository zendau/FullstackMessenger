<template>
  <ChatNavbar />
  <section class="chat__container">
    <ChatsList
      v-if="showChats"
      @open-chat="openChatRoom"
      @set-last-chat-element="setLastChatElement"
    />
    <ContactsContainer
      v-else
      @open-chat="openChatRoom"
    />
    <ChatContainer :chat-id="chatId" />
  </section>
  <UserModal />
</template>

<script>
import { computed, provide, inject, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import ChatNavbar from "@/components/navbar/ChatNavbar.vue";
import ContactsContainer from "@/components/chat/contacts/ContactsContainer.vue";
import ChatContainer from "@/components/chat/ChatContainer.vue";
import ChatsList from "@/components/chat/chatsList/ChatsList.vue";
import UserModal from "@/components/chat/modals/UserModal.vue";

import { insertUsersList } from "@/store/modules/users.module";

export default {
  components: { ChatNavbar, ContactsContainer, ChatContainer, ChatsList, UserModal },
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
    provide("chatId", chatId);
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
      console.log(chatId.value);
    });

    onUnmounted(() => {
      console.log("UNMOUNTED");
      window.removeEventListener("keyup", closeActiveChat);
    });

    const chatObserver = new IntersectionObserver(
      (entries) => {
        console.log("OBSERVER CHAT", entries);
        if (entries[0].isIntersecting) {
          store.dispatch("chat/getChats");
        }
      },
      {
        rootMargin: "100px",
      }
    );

    store.dispatch("chat/getChats", {
      chatId: chatId.value,
    });

    chatSocket.on("newChat", (chatData) => {
      chatData.users = insertUsersList(chatData.users);

      store.commit("chat/saveChat", chatData);
      if (chatData.adminId === userId.value || isCallSendAfterCreate.value) {
        router.push(`/chat/${chatData.id}`);
      }
    });

    chatSocket.on("chatSocketError", (errorData) => {
      store.commit("alert/setErrorMessage", errorData.message);
    });

    function openChatRoom(roomId, isFirstLoad = false) {
      isFirstChatsLoad = false;
      console.log("OPEN CHAT ROOM");

      const { isPushed } = route.query;

      if (!roomId || (chatId.value === roomId && !isFirstLoad)) return;

      isShowMobileMessages.value = true;

      if (!isPushed) {
        router.push(`/chat/${roomId}`);

        if (roomId === "contact") {
          console.log("PUSH TO CHAT");
          router.push(`/chat`);
          return;
        }
      }
      route.query.isPushed = false;

      const chatData = store.state.chat.chats.get(roomId);
      const paginationPage = chatData?.loadMessagesPagination?.page;

      if (!paginationPage) {
        store.commit("chat/clearChatMessages", roomId);
        console.log("GET CHAT MESSGES");
        store.dispatch("chat/getChatMessages", roomId);
      }
    }

    function setLastChatElement(el) {
      if (!el) return;
      console.log("set observer", el);
      chatObserver.disconnect();
      chatObserver.observe(el);
      if (chatId.value && isFirstChatsLoad) {
        console.log("OPEN HERE");
        openChatRoom(chatId.value, true);
      }
    }

    function closeActiveChat(e) {
      if (e.key !== "Escape") return;
      router.push("/chat");
      store.commit("chat/clearTempData");
    }

    return {
      chatId,
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
    background-color: var(--button-chat-color);
    border: none;
    color: var(--color-primary);
    border-radius: 2px;
    padding: 5px 9px;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
      background-color: var(--button-chat-hover);
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
