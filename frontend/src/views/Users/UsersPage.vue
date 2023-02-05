<template>
  <ContactsContainer @open-chat="openChatRoom" />
  <UserModal />
</template>

<script>
import { ref, provide } from "vue";

import ContactsContainer from "@/components/chat/contacts/ContactsContainer.vue";
import UserModal from "@/components/chat/modals/UserModal.vue";
import { useRouter } from "vue-router";

export default {
  components: { ContactsContainer, UserModal },
  setup() {
    const createGroupUsers = ref([]);
    provide("createGroupUsers", createGroupUsers);

    const router = useRouter();

    const modalUserId = ref(null);
    provide("modalUserId", modalUserId);

    function openChatRoom(roomId) {
      if (!roomId) return;

      router.push({
        path: `/chat/${roomId}`,
        query: { isPushed: true },
      });
    }

    return {
      openChatRoom,
    };
  },
};
</script>

<style></style>
