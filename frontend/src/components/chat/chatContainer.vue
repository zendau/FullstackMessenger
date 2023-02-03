<template>
  <div
    v-if="chatData?.title"
    class="chat__messages"
    :class="{ 'chat__messages--active': isShowMobileMessages, 'chat__messages--conference': isConferenceChat }"
  >
    <ChatHeader
      v-if="!isConferenceChat"
      @delete-messages="deleteMessagesMany"
    />
    <ChatBody @delete-messages="deleteMessages" />
    <ChatSend :is-private-banned="isPrivateBanned" />
  </div>
</template>

<script>
import { computed, inject, provide, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import ChatHeader from "@/components/chat/chatHeader/ChatHeader.vue";
import ChatBody from "@/components/chat/chatBody/ChatBody.vue";
import ChatSend from "@/components/chat/chatSend/ChatSend.vue";
export default {
  components: { ChatHeader, ChatBody, ChatSend },
  setup() {
    const store = useStore();
    const userId = computed(() => store.state.auth.user.id);

    const router = useRouter();

    const isShowMobileMessages = inject("isShowMobileMessages", false);
    const chatSocket = inject("chatSocket");

    const chatId = inject("chatId");

    const files = ref([]);
    provide("files", files);

    const editMessageData = ref(null);
    provide("editMessageData", editMessageData);

    const selectedMessages = ref([]);
    provide("selectedMessages", selectedMessages);

    const isSelectMessagesMode = ref(false);
    provide("isSelectMessagesMode", isSelectMessagesMode);

    const isConferenceChat = inject("isConferenceChat", false);

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

    chatSocket.on("newMessage", (messagesData) => {
      store.dispatch("chat/newChatMessage", {
        messagesData,
        userId: userId.value,
      });
    });

    chatSocket.on("inviteChatUser", (inseredUserData) => {
      console.log("inseredUserData", inseredUserData);
      if (inseredUserData?.adminId === userId.value) {
        store.commit("chat/updateFreeChatUsers", inseredUserData.userData.id);
      }

      if (inseredUserData.userData.id === userId.value) {
        store.dispatch("chat/getChatMessages", {
          chatId: inseredUserData.inseredData.chatId,
          userId: userId.value,
        });
      } else {
        store.commit("chat/addUserToGroup", {
          chatId: inseredUserData.inseredData.chatId,
          userData: inseredUserData.userData,
        });
      }
    });

    chatSocket.on("removeChatUser", (removeUser) => {
      store.dispatch("chat/deleteFromChat", removeUser);

      if (removeUser?.adminId === userId.value) {
        store.commit("chat/pushFreeChatUsers", removeUser.deletedUserInfo);
      }
    });

    chatSocket.on("deletedChatGroup", (removeData) => {
      if (removeData.chatId === chatId.value) {
        router.push("/chat");
      }

      store.commit("chat/deleteChatData", removeData.chatId);
      store.commit("chat/clearChatMessages", removeData.chatId);
    });

    const chatData = computed(() => store.getters["chat/selectedChat"](chatId.value));
    provide("chatData", chatData);
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

    return {
      deleteMessages,
      deleteMessagesMany,
      isPrivateBanned,
      isShowMobileMessages,
      chatData,
      isConferenceChat,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat__messages {
  display: grid;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
  grid-template-rows: 58px 1fr;
  background-color: var(--menuColor);

  &--conference {
    grid-template-rows: 1fr;
  }
}
</style>
