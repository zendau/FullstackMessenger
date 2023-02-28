<template>
  <ContactsContainer @open-chat="openChatRoom" />
  <UserModal />
</template>

<script>
import { provide, ref } from "vue";

import ContactsContainer from "@/components/chat/contacts/ContactsContainer.vue";
import UserModal from "@/components/chat/modals/UserModal.vue";
import { useRouter } from "vue-router";

export default {
  components: { ContactsContainer, UserModal },
  setup() {
    const createGroupUsers = ref([]);
    provide("createGroupUsers", createGroupUsers);

    const router = useRouter();
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

<style scoped>
:deep(.searchCreate__container) {
  width: 50%;
  margin: 0 auto;
  box-shadow: none;
}

:deep(.contacts__btn) {
  width: 140px;
}

:deep(.contacts__list) {
  width: 550px;
  margin: 15px auto;
}

:deep(.contacts__container) {
  flex-direction: row;
  margin: 0 auto;
}

.chat__contacts {
  height: calc(100vh - 50px);
  background-color: var(--color-background-secondary);
}

@media (max-width: 720px) {
  :deep(.contacts__container) {
    flex-direction: column;
    margin: 0 10px;
  }

  :deep(.contacts__btn) {
    width: 100%;
  }

  :deep(.contacts__list) {
    width: 100%;
    margin: 15px auto;
  }

  :deep(.contact__checkbox) {
    right: 10px;
  }

  .chat__contacts {
    height: auto;
    max-height: initial;
  }
}
</style>
