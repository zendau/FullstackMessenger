<template>
  <div
    class="chats__container"
    :class="{ 'chats__container--active': isShowMobileMessages }"
  >
    <SearchCreateGroup @search-pattern="searchChats" />
    <LoadingContent v-if="isLoading" />
    <p
      v-else-if="chatsList.size === 0"
      class="empty_message"
    >
      {{ $t("chat.list.empty") }}
    </p>
    <ul
      v-else
      class="chats__list"
    >
      <ChatListItem
        v-for="(chat, index) in chatsList"
        :key="chat[1].id"
        :ref="(el) => setLastChatItem(el, index)"
        :index="index"
        :chat-data="chat[1]"
        @open-chat="openChat"
      />
    </ul>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import SearchCreateGroup from "@/components/chat/SearchCreateGroup/SearchCreateGroup.vue";
import ChatListItem from "@/components/chat/chatsList/ChatListItem.vue";
import LoadingContent from "@/components/UI/LoadingContent.vue";

export default {
  components: { SearchCreateGroup, ChatListItem, LoadingContent },
  emits: ["open-chat", "set-last-chat-element"],
  setup(_, { emit }) {
    const store = useStore();

    const searchPattern = ref(null);
    const isShowMobileMessages = inject("isShowMobileMessages");
    const chatsData = computed(() => store.state.chat.chats);

    const isLoading = computed(() => store.state.chat.isLoading)

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

      store.dispatch("chat/getChatsByPattern", pattern);
    };

    function setLastChatItem(component, index) {
      const el = component?.$el;
      if (searchPattern.value || !el) return;

      if (chatsData.value.size - 1 !== index) return;
      emit("set-last-chat-element", el);
    }

    function lastMessageHTMLConvert(text) {
      return text?.replaceAll("<br>", " ").replace(/<\/?[^>]+(>|$)/g, "");
    }

    return {
      isLoading,
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

<style lang="scss">
.chats {
  &__list {
    overflow: auto;
    margin-top: 2px;
    height: 100%;
  }

  &__container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
    box-sizing: border-box;
    background-color: var(--color-background);

    button {
      margin-bottom: 10px;
      width: 100px;
      align-self: center;
    }
  }

  &__item {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    justify-items: center;
    height: 60px;
    gap: 10px;

    transition: 0.3s ease;
    cursor: pointer;
    color: var(--color-primary);
    a {
      color: inherit;
      text-decoration: none;
      width: 100%;
      height: 100%;
      padding: 14.5px 0;
      display: flex;
    }

    &:hover {
      background-color: var(--color-background-item);
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
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 50px;
    grid-template-rows: 1fr 1fr;
    height: 100%;
    align-items: center;

    p {
      padding: 0 5px;
      box-sizing: border-box;
    }
  }
}

.chat {
  &__last-message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    color: var(--color-secondary);
    align-self: baseline;
  }
}

@media (max-width: 720px) {
  .chats {
    &__container {
      &--active {
        display: none;
      }
    }
  }
}
</style>
