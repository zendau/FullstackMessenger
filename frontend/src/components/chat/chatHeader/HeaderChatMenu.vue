<template>
  <button
    v-if="isChatAdmin"
    class="chat__exit"
    @click="isShowConfirmModal = true"
  >
    Delete chat
  </button>
  <button
    v-else
    class="chat__exit"
    @click="exitFromChat"
  >
    Exit chat
  </button>
  <ConfirmModal
    :is-open-modal="isShowConfirmModal"
    :action-handler="deleteChat"
    :title="'Delete selected chat ?'"
    @close-confirm-modal="isShowConfirmModal = false"
  />
</template>

<script>
import { ref, inject, computed } from "vue";
import { useRoute } from "vue-router";

import ConfirmModal from "@/components/chat/modals/ConfirmModal.vue";

export default {
  components: { ConfirmModal },
  props: {
    adminId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    chatUsers: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const isShowConfirmModal = ref(false);
    const chatSocket = inject("chatSocket");
    const route = useRoute();

    const chatId = computed(() => route.params.id);

    const isChatAdmin = computed(() => props.adminId === props.userId);

    function exitFromChat() {
      chatSocket.emit("exit-chat", {
        chatId: chatId.value,
        userId: props.userId,
        users: props.chatUsers,
        adminId: null,
      });
    }

    function deleteChat() {
      chatSocket.emit("deleteChat", {
        chatId: chatId.value,
        adminId: props.userId,
      });
    }

    return {
      exitFromChat,
      deleteChat,
      isChatAdmin,
      isShowConfirmModal,
    };
  },
};
</script>

<style></style>
