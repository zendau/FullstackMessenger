<template>
  <div
    v-if="chatData?.title"
    class="chat__messages"
    :class="{ 'chat__messages--active': isShowMobileMessages, 'chat__messages--conference': isConferenceChat }"
  >
    <ChatHeader
      v-if="!isConferenceChat"
      :is-private-banned="isPrivateBannedStatus"
      @delete-messages="deleteMessagesMany"
    />
    <ChatBody @delete-messages="deleteMessages" />
    <ChatSend :is-private-banned="isPrivateBannedStatus" />
  </div>
</template>

<script>
import { computed, inject, provide, ref, watch, onUnmounted, onMounted } from "vue";
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

    onMounted(() => {
      chatSocket.on("newMessage", (messagesData) => {
        store.dispatch("chat/newChatMessage", {
          messagesData,
          userId: userId.value,
        });
      });
    });

    onUnmounted(() => {
      chatSocket.removeAllListeners("newMessage");
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

    chatSocket.on("inviteChatUser", (inseredUserData) => {
      console.log("inseredUserData", inseredUserData);
      if (inseredUserData?.adminId === userId.value) {
        store.commit("chat/updateFreeChatUsers", inseredUserData.inseredData.userId);
      }

      if (inseredUserData.inseredData.userId === userId.value) {
        store.dispatch("chat/getChatMessages", {
          chatId: inseredUserData.inseredData.chatId,
          userId: userId.value,
        });
      } else {
        const userData = store.state.users.usersList.get(inseredUserData.inseredData.userId);

        store.commit("chat/addUserToGroup", {
          chatId: inseredUserData.inseredData.chatId,
          userData,
        });
      }
    });

    chatSocket.on("removeChatUser", (removeUser) => {
      console.log("removeUser", removeUser);
      store.dispatch("chat/deleteFromChat", removeUser);

      if (removeUser?.adminId === userId.value) {
        const deletedUserData = store.state.users.usersList.get(removeUser.deletedUserInfo);

        store.commit("chat/pushFreeChatUsers", deletedUserData);
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
    console.log("CHATDATA", chatData);
    provide("chatData", chatData);
    const privateMemberId = ref(null);
    const privateUserStatus = computed(() => store.state.contact.contactStatutes[privateMemberId.value]);
    const isPrivateBannedStatus = ref(false);

    watch(
      chatData,
      (newChat) => {
        if (newChat?.adminId || newChat?.users === undefined) return;

        privateMemberId.value = Object.values(newChat.users)[0].id;

        if (privateUserStatus.value) return;
        store.dispatch("contact/getContactStatutesData", privateMemberId.value);
      },
      {
        immediate: true,
      }
    );

    watch(
      privateUserStatus,
      (status) => {
        if (status?.isBanned) {
          isPrivateBannedStatus.value = "chat.chatSend.isBanned";
        } else if (status?.isBannedByContact) {
          isPrivateBannedStatus.value = "chat.chatSend.isBannedByContact";
        } else {
          isPrivateBannedStatus.value = false;
        }
      },
      {
        deep: true,
      }
    );

    return {
      deleteMessages,
      deleteMessagesMany,
      isPrivateBannedStatus,
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
  grid-template-rows: 64px 1fr;
  background-color: var(--color-background-secondary);

  &--conference {
    grid-template-rows: 1fr;
  }
}
</style>
