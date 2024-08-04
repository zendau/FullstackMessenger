<template>
  <li
    class="chats__item"
    @click="openChat(chatData.id)"
  >
    <font-awesome-icon
      v-if="chatData.adminId"
      icon="fa-solid fa-user-group"
      class="chat-item__icon"
    />
    <font-awesome-icon
      v-else
      icon="fa-solid fa-user"
      class="chat-item__icon"
    />
    <div class="chats__info">
      <p>{{ chatData.title }}</p>

      <p
        v-if="chatData?.lastMessage?.created_at"
        class="chat-item__time"
      >
        {{ $d(chatData?.lastMessage?.created_at, "time") }}
      </p>
      <p
        v-if="chatData.lastMessage?.text && chatData.lastMessage.authorId"
        class="chat__last-message"
      >
        <span v-if="chatData.adminId"> {{ chatData.lastMessage?.authorLogin }}: </span>
        {{ clearMessage(chatData.lastMessage?.text) }}
      </p>
      <p
        v-if="chatData.userUnread"
        class="chat-item__unread"
      >
        {{ chatData.userUnread }}
      </p>
    </div>
  </li>
</template>

<script>
import messageHTMLConvert from "@/utils/messageHTMLConvert";

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
  emits: ["open-chat"],
  setup(_, { emit }) {
    function openChat(chatId) {
      emit("open-chat", chatId);
    }

    function clearMessage(message) {
      return messageHTMLConvert(message).replaceAll("&nbsp;", "");
    }

    return {
      clearMessage,
      openChat,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat-item {
  &__icon {
    height: 25px;
    width: 25px;
    padding: 5px;
  }

  &__time {
    font-size: 14px;
    text-align: center;
  }

  &__unread {
    text-align: center;
    height: 25px;
    background-color: var(--button-chat-color);
    width: 25px;
    border-radius: 50%;
    justify-self: center;
    font-size: 16px;
    line-height: 25px;
    grid-column: 2/3;
  }
}
</style>
