<template>
  <div
    class="chat__messages"
    :class="{ 'chat__messages--active': isShowMobileMessages }"
  >
    <ChatHeader
      v-if="chatData?.title"
      @delete-messages="deleteMessagesMany"
    />
    <chat-body
      v-if="chatData?.title"
      @deleteMessages="deleteMessages"
    />
    <template v-if="chatData?.title">
      <div
        v-if="isPrivateBanned"
        style="color: white"
      >
        BANNED
      </div>
      <chat-send v-else />
    </template>
  </div>
</template>

<script>
import { computed, inject, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import ChatHeader from "@/components/chat/chatHeader/ChatHeader.vue";
import ChatBody from "@/components/chat/ChatBody.vue";
import ChatSend from "@/components/chat/chatSend/ChatSend.vue";
export default {
  components: { ChatHeader, ChatBody, ChatSend },
  setup() {
    const store = useStore();
    const route = useRoute();

    const chatId = computed(() => route.params.id);
    const userId = computed(() => store.state.auth.user.id);

    const isShowMobileMessages = inject("isShowMobileMessages");
    const chatSocket = inject("chatSocket");

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

    chatSocket.on("updateUserOnline", (userStatus) => {
      store.commit("chat/updateUserOnline", userStatus);
      store.commit("contact/updateUserOnline", userStatus);
    });

    function deleteMessages(messagesList) {
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
      store.dispatch("chat/deletedMessages", payload);
    });

    const chatData = computed(() => store.getters["chat/selectedChat"](chatId.value));

    const privateMemberId = ref(null);
    const isPrivateBanned = computed(() => {
      const data = store.state.contact.users[privateMemberId.value];

      if (!data) return null;
      return data.isBanned || data.isBannedByContact;
    });

    watch(chatData, (newChat) => {
      if (newChat?.adminId || newChat?.users === undefined) return;

      privateMemberId.value = newChat.users[0].id;

      console.log("memberData", isPrivateBanned.value);
      if (isPrivateBanned.value !== null) return;
      store.dispatch("contact/getContactData", {
        userId: userId.value,
        contactId: privateMemberId.value,
      });
    });

    provide("chatData", chatData);
    return {
      deleteMessages,
      deleteMessagesMany,
      isPrivateBanned,
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
