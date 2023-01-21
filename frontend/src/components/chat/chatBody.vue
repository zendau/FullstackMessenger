<template>
  <file-upload>
    <div class="chat__body" ref="bodyRef">
      <MessageContexMenu
        :ctxMenuData="ctxMenuData"
        @deleteMessages="deleteMessages"
      />
      <template v-for="(message, index) in messages" :key="message.id">
        <message
          v-if="message.authorLogin"
          :message="message"
          :isFirstUnread="isFirstUnread(index)"
          :ref="(el) => setRefMessage(el, index)"
          :isRead="isReadMessage(index)"
          :userId="userData.id"
          @openCTXMenu="openCTXMenu"
        />
        <div
          style="
            width: 100px;
            align-self: center;
            color: white;
            display: flex;
            justify-content: center;
            margin: 5px 10px;
            padding: 10px;
            background-color: var(--messageColor);
            border-radius: 5px;
          "
          v-else
        >
          {{ message.text }}
        </div>
      </template>

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

    const bodyRef = ref(null)

    const isShowMessageCTX = ref(null);
    provide("isShowMessageCTX", isShowMessageCTX);

    const userData = computed(() => store.state.auth.user);
    let messageReadCount = 0;

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
      const resCount = chatData.value.userUnread - messageReadCount;
      chatData.value.userUnread = Math.max(0, resCount);
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
        const messagePagination = chatData.value.loadMessagesPagination;
        debugger;
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
        }
      }
      // {
      //   rootMargin: "100px",
      // }
    );


    // console.log("setup");
    //store.dispatch('chat/getMessges', chatId.value)

    // onUpdated(() => {
    //   console.log("updated");
    // });

    watch(chatId, () => {
      store.commit('chat/clearTempData')
      bodyRef.value.scrollTop = 0
    });

    // onMounted(() => {
    //   console.log("MOUNTED");

    //   //store.dispatch("chat/getMessges", chatId.value);
    //   //observer.observe(scrollEnd.value);
    // });

    chatSocket.on("updateReadMessages", (newData) => {
      console.log("NEW DATA", newData)
      store.commit("chat/updateReadMessages", {
        chatId: chatId.value,
        unreadCount: newData,
      });
    });

    function setRefMessage(el, index) {
      if (!el) return;

      //const roomData = currentTempChatData.value ?? roomsData.value[chatId.value];
      const isLastMessage = index === messages.value?.length - 1;

      if (isLastMessage) {
        console.log("last message", isLastMessage, el.$el.nextElementSibling);
        messageScrollObserver.observe(el.$el.nextElementSibling);
      }
      if (chatData.value.userUnread === 0) return;
      const isReadMessage = index - chatData.value.userUnread;
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
      return index - chatData.value.chatUnread >= 0;
    }

    function isFirstUnread(index) {
      console.log('isFirstUnread', index, chatData.value.userUnread)
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
      bodyRef,
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
