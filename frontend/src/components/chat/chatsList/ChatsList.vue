<template>
  <div
    class="chats__container"
    :class="{ 'chats__container--active': !isShowMobileMessages }"
  >
    <SearchCreateGroup @search-pattern="searchChats" />
    <p
      v-if="chatsList.size === 0"
      class="empty_message"
      style="color: red"
    >
      No chats
    </p>
    <ul class="chats__list">
      <ChatListItem
        v-for="(chat, index) in chatsList"
        :key="chat[1].id"
        :index="index"
        :chat-data="chat[1]"
      />
    </ul>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import SearchCreateGroup from "@/components/chat/SearchCreateGroup.vue";
import ChatListItem from "@/components/chat/chatsList/ChatListItem.vue";

export default {
  components: { SearchCreateGroup, ChatListItem },
  emits: ["open-chat", "set-last-chat-element"],
  setup(_, { emit }) {
    const store = useStore();

    const searchPattern = ref(null);
    const isShowMobileMessages = inject("isShowMobileMessages");
    const chatsData = computed(() => store.state.chat.chats);
    const userId = computed(() => store.state.auth.user.id);
    function openChat(chatId) {
      emit("open-chat", chatId);
    }

    const chatsList = computed(() => store.getters["chat/chatList"]);

    const searchChats = (pattern) => {
      searchPattern.value = pattern;

      if (searchPattern.value.length === 0) {
        store.commit("chat/clearChatsByPattern");
        return;
      }

      store.dispatch("chat/getChatsByPattern", {
        userId: userId.value,
        pattern,
      });
    };

    function setLastChatItem(el, index) {
      if (searchPattern.value) return;

      if (chatsData.value.size - 1 !== index) return;

      emit("set-last-chat-element", el);
    }

    function lastMessageHTMLConvert(text) {
      return text?.replaceAll("<br>", " ").replace(/<\/?[^>]+(>|$)/g, "");
    }

    return {
      isShowMobileMessages,
      chatsData,
      searchChats,
      chatsList,
      openChat,
      setLastChatItem,
      lastMessageHTMLConvert,
    };
  },
};
</script>

<style lang="scss" scoped>
.chats {
  &__list {
    overflow: auto;

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

  &__container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
    box-sizing: border-box;
    background-color: var(--bgcColor);

    button {
      margin-bottom: 10px;
      width: 100px;
      align-self: center;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    transition: 0.3s ease;
    cursor: pointer;
    color: var(--textColor);
    a {
      color: inherit;
      text-decoration: none;
      width: 100%;
      height: 100%;
      padding: 14.5px 0;
      display: flex;
    }

    &:hover {
      background-color: var(--itemColor);
    }
    input {
      margin: 0 5px;
    }

    i {
      margin: 0 10px;
      font-size: 26px;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
}

.chat {
  &__last-message {
    width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    text-align: center;
  }
}

.router-link-active {
  background-color: #2b5278;
}
</style>
