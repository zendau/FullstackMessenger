<template>
  <div
    class="chat__messages"
    :class="{ 'chat__messages--active': isShowMobileMessages }"
  >
    <chat-header v-if="chatData?.title" @deleteMessages="deleteMessagesMany" />
    <chat-body v-if="chatData?.title" @deleteMessages="deleteMessages" />
    <chat-send v-if="chatData?.title" />
  </div>
</template>

<script>
import chatHeader from "./chatHeader.vue";
import chatBody from "./chatBody.vue";
import chatSend from "./chatSend.vue";
import { computed, inject, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default {
  components: { chatHeader, chatBody, chatSend },
  setup() {
    const store = useStore();
    const route = useRoute();

    const chatId = computed(() => route.params.id);

    const isShowMobileMessages = inject("isShowMobileMessages");
    const chatSocket = inject("chatSocket")

    const files = ref([]);
    provide("files", files);

    const editMessageData = ref(null);
    provide("editMessageData", editMessageData);

    const selectedMessages = ref([]);
    provide("selectedMessages", selectedMessages);

    const isSelectMessagesMode = ref(false);
    provide("isSelectMessagesMode", isSelectMessagesMode);

    watch(selectedMessages, (value) => {
      if (value.length === 0) isSelectMessagesMode.value = false;
    });

    function deleteMessages(messagesList) {
      console.log("delete messages2: - ", messagesList);
      chatSocket.emit("delete_messages", {
        roomId: chatId.value,
        deletedData: messagesList,
      });
    }

    function deleteMessagesMany() {
      deleteMessages(selectedMessages.value);
      selectedMessages.value = [];
    }

    chatSocket.on("updateDeletedMessages", (payload) => {
      console.log('delete messages', payload)
      store.dispatch('chat/deletedMessages', payload)
    });

    const chatData = computed(() => store.state.chat.chats[chatId.value]);
    console.log("CHATDATA", chatData, chatId.value);
    return {
      deleteMessages,
      deleteMessagesMany,
      isShowMobileMessages,
      chatData,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat__messages {
  display: grid;
  max-height: 100vh;
  overflow: hidden;
  grid-template-rows: 58px 1fr;
  background-color: var(--menuColor);
}
</style>
