<template>
  <li
    :ref="(el) => setLastChatItem(el, index)"
    class="chats__item"
    @click="openChat(chatData.id)"
  >
    <i
      v-if="chatData.adminId"
      class="bi bi-people"
    />
    <i
      v-else
      class="bi bi-person"
    />
    <div class="chats__info">
      <p>{{ chatData.title }}</p>
      <p>{{ chatData.lastMessage?.authorLogin }}</p>
      <p class="chat__last-message">
        {{ lastMessageHTMLConvert(chatData.lastMessage?.text) }}
      </p>
      <p>{{ chatData.userUnread }}</p>
    </div>
  </li>
</template>

<script>
import lastMessageHTMLConvert from "@/utils/messageHTMLConvert";

export default {
  props: {
    chatData: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ["set-last-chat-element", "open-chat"],
  setup(_, { emit }) {
    function setLastChatItem(el, index) {
      emit("set-last-chat-element", el, index);
    }

    function openChat(chatId) {
      emit("open-chat", chatId);
    }

    return {
      lastMessageHTMLConvert,
      setLastChatItem,
      openChat,
    };
  },
};
</script>

<style></style>
