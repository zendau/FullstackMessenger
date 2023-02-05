<template>
  <ContactsContainer @open-chat="openChatRoom" />
  <UserModal />
</template>

<script>
import { ref, provide } from "vue";

import ContactsContainer from "@/components/chat/contacts/ContactsContainer.vue";
import UserModal from "@/components/chat/modals/UserModal.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: { ContactsContainer, UserModal },
  setup() {
    const createGroupUsers = ref([]);
    provide("createGroupUsers", createGroupUsers);

    const router = useRouter();
    const store = useStore();

    const userId = store.state.auth.user.id;

    const modalUserId = ref(null);
    provide("modalUserId", modalUserId);

    function openChatRoom(roomId) {
      if (!roomId) return;

      console.log("PUSH 1");
      router.push(`/chat/${roomId}`);

      if (roomId === "contact") {
        console.log("PUSH 2");
        router.push(`/chat`);
        return;
      }

      const chatData = store.state.chat.chats.get(roomId);
      const paginationPage = chatData?.loadMessagesPagination?.page;

      if (!paginationPage) {
        store.commit("chat/clearChatMessages", roomId);
        store.dispatch("chat/getChatMessages", {
          chatId: roomId,
          userId,
        });
      }
    }

    return {
      openChatRoom,
    };
  },
};
</script>

<style></style>
