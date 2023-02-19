<template>
  <file-upload>
    <div
      ref="bodyRef"
      class="chat__body"
      :class="{ 'chat__body--mini': isConferenceChat }"
    >
      <MessageContexMenu
        :ctx-menu-data="ctxMenuData"
        @delete-messages="deleteMessages"
      />
      <template
        v-for="(message, index) in messages"
        :key="message.id"
      >
        <MessageContainer
          v-if="message.authorLogin"
          :ref="(el) => setRefMessage(el, index)"
          :message="message"
          :is-first-unread="isFirstUnread(index)"
          :is-read="isReadMessage(index)"
          :user-id="userData.id"
          @open-ctx-menu="openCTXMenu"
        />
        <MessageSystemInfo
          v-else
          :message-type="message.type"
          :message-text="message.text"
        />
      </template>

      <div ref="scrollEnd" />
    </div>
  </file-upload>
</template>

<script>
import { useRoute } from "vue-router";
import { inject, ref, computed, watch, provide } from "vue";
import { useStore } from "vuex";

import debounce from "@/utils/debounce";

import MessageContainer from "@/components/chat/chatBody/message/MessageContainer.vue";
import MessageSystemInfo from "@/components/chat/chatBody/message/MessageSystemInfo.vue";
import MessageContexMenu from "@/components/chat/chatBody/message/MessageContextMenu.vue";
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: { MessageContainer, FileUpload, MessageContexMenu, MessageSystemInfo },
  emits: ["delete-messages"],
  setup(_, { emit }) {
    const store = useStore();
    const route = useRoute();

    const chatSocket = inject("chatSocket");
    const selectedMessages = inject("selectedMessages");
    const chatId = inject("chatId");
    const messages = computed(() => store.state.chat.messages[chatId.value]);
    const userId = computed(() => store.state.auth.user.id);
    const scrollEnd = ref(null);
    const chatData = inject("chatData");
    const isConferenceChat = inject("isConferenceChat", false);

    const isFirstMessageUnread = ref(null);

    const bodyRef = ref(null);

    const isShowMessageCTX = ref(null);
    provide("isShowMessageCTX", isShowMessageCTX);

    let isFirstScroll = true;

    const userData = computed(() => store.state.auth.user);
    let messageReadCount = 0;

    chatSocket.on("updateMessage", (updatedMessageData) => {
      console.log("updated payload", updatedMessageData);
      store.dispatch("chat/editChatMesssage", updatedMessageData);
    });

    const readChatMessage = debounce(() => {
      console.log("send ", messageReadCount);

      const userUnread = chatData.value?.userUnread;
      if (!userUnread) return;

      chatSocket.emit("readMessages", {
        userId: userData.value.id,
        chatData: chatData.value,
        count: messageReadCount,
      });

      const resCount = chatData.value.userUnread - messageReadCount;
      chatData.value.userUnread = Math.max(0, resCount);
      messageReadCount = 0;
    }, 500);

    const readMessageObserver = new IntersectionObserver((entries) => {
      console.log("observer . Message 1", entries);

      entries.forEach((entrie) => {
        if (entrie.isIntersecting) {
          messageReadCount++;
          console.log("unobserve", entrie.target, messageReadCount, readMessageObserver);
          readMessageObserver.unobserve(entrie.target);
        }
      });

      readChatMessage();
    });

    const messageScrollObserver = new IntersectionObserver(
      (entries) => {
        const messagePagination = chatData.value?.loadMessagesPagination;
        isFirstScroll = false;
        if (entries[0].isIntersecting && messagePagination?.hasMore) {
          console.log("load message scrool observer", {
            chatId: chatId.value,
            page: messagePagination.page,
            limit: messagePagination.limit,
            inMemory: messagePagination.inMemory,
          });
          messageScrollObserver.unobserve(entries[0].target);

          console.log("!1");
          store.dispatch("chat/getChatMessages", {
            chatId: chatId.value,
            userId: userId.value,
          });
          readMessageObserver.disconnect();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    watch(chatId, (curId) => {
      isFirstScroll = true;
      bodyRef.value.scrollTop = 0;

      if (!curId) return;
      store.commit("chat/clearTempData");
    });

    chatSocket.on("updateReadMessages", (newData) => {
      console.log("### NEW DATA ###", newData, route, chatId, typeof chatId.value);
      store.commit("chat/updateReadMessages", {
        chatId: chatId.value,
        unreadCount: newData,
      });
    });

    function setRefMessage(el, index) {
      if (!el) return;
      const isLastMessage = index === messages.value?.length - 1;

      if (isLastMessage) {
        messageScrollObserver.observe(el.$el.nextElementSibling);
        console.log("SET", isFirstMessageUnread.value, isFirstScroll);
        if (messages.value?.length - 1 === 0 || !isFirstMessageUnread.value || !isFirstScroll) return;
        console.log("isFirstMessageUnread scrollIntoView", isFirstMessageUnread);

        isFirstMessageUnread.value.scrollIntoView();
      }
      if (chatData.value.userUnread === 0) return;
      const isReadMessage = index - chatData.value.userUnread;
      // console.log("EL!!!", el, index, roomData.value, res);
      if (isReadMessage < 0) {
        console.log("++isReadMessage++", chatData.value.userUnread, el.$el.nextElementSibling);
        readMessageObserver.observe(el.$el.nextElementSibling);
      }

      if (isFirstUnread(index)) {
        isFirstMessageUnread.value = el.$el.nextElementSibling;
        console.log("SETTTTTTTTTTTTT", isFirstMessageUnread.value);
      }
    }

    function isReadMessage(index) {
      return index - chatData.value.chatUnread >= 0;
    }

    function isFirstUnread(index) {
      return index - chatData.value.userUnread === -1;
    }

    const ctxMenuData = ref({
      isShow: false,
    });

    function openCTXMenu(CTXdata) {
      console.log("openCTXMenu", CTXdata);
      ctxMenuData.value = CTXdata;
    }

    function deleteMessages(messagesList) {
      emit("delete-messages", messagesList);
    }

    function deleteMessagesHandler() {
      deleteMessages(selectedMessages.value);
      selectedMessages.value = [];
    }

    return {
      isConferenceChat,
      isReadMessage,
      isFirstUnread,
      setRefMessage,
      openCTXMenu,
      deleteMessages,
      deleteMessagesHandler,
      ctxMenuData,
      scrollEnd,
      messages,
      userData,
      bodyRef,
      chatId,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__body {
    display: flex;
    flex-direction: column-reverse;
    overflow: auto;
    background-color: var(--color-background-secondary);
    padding: 1px 0;
    box-sizing: border-box;

    height: 100%;

    &--mini {
      padding: 10px;
    }
  }
}

@media (max-width: 960px) {
  .chat {
    &__body {
      padding: 10px;
      align-items: center;
    }
  }
}

@media (max-width: 720px) {
  .chat {
    &__body {
      padding: 0;
      border-left: 1px solid black;
    }
  }
}
</style>
