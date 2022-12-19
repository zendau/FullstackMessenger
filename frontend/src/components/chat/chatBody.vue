<template>
  <file-upload>
    <div class="chat__body">
      <message
        v-for="(message, index) in messages"
        :key="message.id"
        :message="message"
        :isFirstUnread="isFirstUnread(index)"
        :ref="(el) => setRefMessage(el, index)"
        :isRead="isReadMessage(index)"
        :userId="userData.id"
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
export default {
  components: { Message, FileUpload },
  setup() {
    const store = useStore();
    const route = useRoute();

    const chatSocket = inject("chatSocket");
    const chatId = computed(() => route.params.id);
    const messages = computed(() => store.state.chat.messages[chatId.value]);
    const scrollEnd = ref(null);
    const chatData = store.getters["chat/selectedChat"](chatId.value);


    const isShowMessageCTX = ref(null);
    provide("isShowMessageCTX", isShowMessageCTX);

    const userData = computed(() => store.state.auth.user);

    chatSocket.on("newMessage", (messagesData) => {
      store.dispatch("chat/newChatMessage", {
        messagesData,
        chatSocket,
        userId: userData.value.id,
      });
    });
    // chatSocket.on("updateUserCount", (userId) => {
    //   console.log("user exit from chat", userId);
    //   store.commit("chat/removeUserFromGroup", userId);
    // });

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

    function setRefMessage(el, index) {
      // //const roomData = currentTempChatData.value ?? roomsData.value[chatId.value];
      // const isLastMessage = index === roomMessages[chatId.value]?.length - 1;
      // if (isLastMessage) {
      //   console.log("setLastMessage", el.$el);
      //   console.log("last message", isLastMessage, el.$el);
      //   messageScrollObserver.observe(el.$el);
      // }
      // if (roomData.value.unread === 0) return;
      // const res = index - roomData.value.unread;
      // // console.log("EL!!!", el, index, roomData.value, res);
      // if (res < 0) {
      //   console.log("SET OBSERVER", observer, observer.takeRecords());
      //   observer.observe(el.$el);
      // }
    }

    function isReadMessage(index) {
      return index - chatData.isNotUnread >= 0;
    }

    function isFirstUnread(index) {
      return index - chatData.unread === -1;
    }

    return {
      isReadMessage,
      isFirstUnread,
      setRefMessage,
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
