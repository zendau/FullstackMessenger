<template>
  <file-upload>
    <div class="chat__body">
      <MessageContexMenu
        :ctxMenuData="ctxMenuData"
        @deleteMessages="deleteMessages"
      />
      <message
        v-for="(message, index) in messages"
        :key="message.id"
        :message="message"
        :isFirstUnread="isFirstUnread(index)"
        :ref="(el) => setRefMessage(el, index)"
        :isRead="isReadMessage(index)"
        :userId="userData.id"
        @openCTXMenu="openCTXMenu"
      />
      <div ref="scrollEnd"></div>
    </div>
  </file-upload>
</template>

<script>
import Message from "./message.vue";

//import $api from '../../axios'

import { useRoute } from "vue-router";
import {
  inject,
  ref,
  computed,
  onMounted,
  onUpdated,
  watch,
  provide,
} from "vue";
import { useStore } from "vuex";
import FileUpload from "../fileUpload.vue";
import MessageContexMenu from "./messageContextMenu.vue";

import debounce from "../../utils/debounce";

export default {
  components: { Message, FileUpload, MessageContexMenu },
  setup(_, { emit }) {
    const store = useStore();
    const route = useRoute();

    const chatSocket = inject("chatSocket");
    const selectedMessages = inject("selectedMessages");
    const chatId = computed(() => route.params.id);
    const messages = computed(() => store.state.chat.messages[chatId.value]);
    const userId = computed(() => store.state.auth.user.id);
    const scrollEnd = ref(null);
    const chatData = inject("chatData");

    const isShowMessageCTX = ref(null);
    provide("isShowMessageCTX", isShowMessageCTX);

    const userData = computed(() => store.state.auth.user);
    let messageReadCount = 0;
    chatSocket.on("newMessage", (messagesData) => {
      console.log("newMessage", messagesData);
      store.dispatch("chat/newChatMessage", {
        messagesData,
        userId: userData.value.id,
      });
    });

    chatSocket.on("updateMessage", (updatedMessageData) => {
      console.log("updated payload", updatedMessageData);
      store.dispatch("chat/editChatMesssage", updatedMessageData);
    });

    // chatSocket.on("updateUserCount", (userId) => {
    //   console.log("user exit from chat", userId);
    //   store.commit("chat/removeUserFromGroup", userId);
    // });

    const readChatMessage = debounce(() => {
      console.log("send ", messageReadCount);

      chatSocket.emit("readMessages", {
        userId: userData.value.id,
        chatId: chatId.value,
        count: messageReadCount,
      });

      //const roomData = currentTempChatData.value ?? roomsData.value[chatId.value];
      const resCount = chatData.userUnread - messageReadCount;
      chatData.userUnread = Math.max(0, resCount);
      messageReadCount = 0;
    }, 1000);

    const readMessageObserver = new IntersectionObserver(
      (entries) => {
        console.log("observer . Message 1", entries);
        if (entries[0].isIntersecting) {
          console.log("observer . Message 2", entries);
          entries.forEach((entrie) => {
            messageReadCount++;
            console.log(
              "unobserve",
              entrie.target,
              messageReadCount,
              readMessageObserver
            );
            readMessageObserver.unobserve(entrie.target);
          });

          readChatMessage();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    const messageScrollObserver = new IntersectionObserver(
      (entries) => {
        const messagePagination = chatData.loadMessagesPagination;
        if (entries[0].isIntersecting && messagePagination?.hasMore) {
          console.log("load message scrool observer", {
            chatId: chatId.value,
            page: messagePagination.page,
            limit: messagePagination.limit,
            inMemory: messagePagination.inMemory,
          });
          messageScrollObserver.unobserve(entries[0].target);

          store.dispatch("chat/getChatMessages", {
            chatId: chatId.value,
            userId: userId.value,
          });
        }
      }
      // {
      //   rootMargin: "100px",
      // }
    );

    const message = computed(() => store.state.chat.message);
    //const isLoadedMessages = ref(false);

    // const observer = new IntersectionObserver(async (entries) => {
    //   console.log(entries, entries[0].isIntersecting, message.value.hasMore);
    //   if (
    //     entries[0].isIntersecting &&
    //     message.value.hasMore &&
    //     messages.value.length !== 0
    //   ) {
    //     console.log("observer");
    //     store.dispatch("chat/getMessges", chatId.value);
    //     //  message.value.page++;
    //     // isLoadedMessages.value = true;
    //     // const messagesRes = await $api.get(
    //     //   `/message/getAllChat/${chatId.value}`,
    //     //   {
    //     //     params: {
    //     //       page:  message.value.page,
    //     //       limit:  message.value.limit,
    //     //     },
    //     //   }
    //     // );
    //     // if (messagesRes.data.length === 0) {
    //     //    message.value.hasMore = false;
    //     // }
    //     // messages.value.push(...messagesRes.data);
    //     // console.log("messagesRes", messagesRes);
    //     // isLoadedMessages.value = false;
    //   }
    // });
    console.log("setup");
    //store.dispatch('chat/getMessges', chatId.value)

    onUpdated(() => {
      console.log("updated");
    });

    // watch(messages, () => {
    //   console.log("UPDATE");
    //   if (messages.value.length === 0) {
    //     store.dispatch("chat/getMessges", chatId.value);
    //     // observer.observe(scrollEnd.value);
    //   }
    // });

    onMounted(() => {
      console.log("MOUNTED");

      //store.dispatch("chat/getMessges", chatId.value);
      //observer.observe(scrollEnd.value);
    });

    chatSocket.on("updateReadMessages", (newData) => {
      store.commit("chat/updateReadMessages", {
        chatId,
        unreadCount,
      });
    });

    function setRefMessage(el, index) {
      if (!el) return;

      //const roomData = currentTempChatData.value ?? roomsData.value[chatId.value];
      const isLastMessage = index === messages.value?.length - 1;
      debugger;
      if (isLastMessage) {
        console.log("last message", isLastMessage, el.$el.nextElementSibling);
        messageScrollObserver.observe(el.$el.nextElementSibling);
      }
      if (chatData.userUnread === 0) return;
      const isReadMessage = index - chatData.userUnread;
      // console.log("EL!!!", el, index, roomData.value, res);
      if (isReadMessage < 0) {
        console.log(
          "SET OBSERVER",
          readMessageObserver,
          readMessageObserver.takeRecords()
        );
        readMessageObserver.observe(el.$el.nextElementSibling);
      }
    }

    function isReadMessage(index) {
      return index - chatData.chatUnread >= 0;
    }

    function isFirstUnread(index) {
      return index - chatData.userUnread === -1;
    }

    const ctxMenuData = ref({
      isShow: false,
    });

    function openCTXMenu(CTXdata) {
      console.log("openCTXMenu", CTXdata);
      ctxMenuData.value = CTXdata;
    }

    function deleteMessages(messagesList) {
      emit("deleteMessages", messagesList);
    }

    function deleteMessagesHandler() {
      deleteMessages(selectedMessages.value);
      selectedMessages.value = [];
    }

    return {
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
    background-color: var(--menuColor);
    padding: 1px 0;

    height: 100%;

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
