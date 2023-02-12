<template>
  <div style="justify-self: end">
    <button @click="initCallConference">
      Call
    </button>
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
  </div>

  <ConfirmModal
    :is-open-modal="isShowConfirmModal"
    :action-handler="deleteChat"
    :title="'Delete selected chat ?'"
    @close-confirm-modal="isShowConfirmModal = false"
  />
</template>

<script>
import { ref, inject, computed } from "vue";

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
    userLogin: {
      type: String,
      required: true,
    },
    peerId: {
      type: String,
      required: true,
    },
    chatTitle: {
      type: String,
      required: true,
    },
    chatUsers: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const isShowConfirmModal = ref(false);
    const chatSocket = inject("chatSocket");

    const chatId = inject("chatId");
    const callingData = inject("callingData");

    const isChatAdmin = computed(() => props.adminId === props.userId);

    function initCallConference() {
      console.log("TEST", props.chatUsers);
      const onlineUsersPeers = Object.values(props.chatUsers).reduce((prev, curr) => {
        if (curr.lastOnline === "online" && curr.id !== props.userId) {
          prev.push(curr.peerId);
        }

        return prev;
      }, []);

      callingData.value = {
        from: {
          peerId: props.peerId,
          login: props.userLogin,
        },
        chatTitle: props.chatTitle,
        users: onlineUsersPeers,
        confrenceId: chatId.value,
      };
    }

    function exitFromChat() {
      chatSocket.emit("exit-chat", {
        chatId: chatId.value,
        userId: props.userId,
        userLogin: props.userLogin,
        users: Object.values(props.chatUsers),
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
      initCallConference,
      exitFromChat,
      deleteChat,
      isChatAdmin,
      isShowConfirmModal,
    };
  },
};
</script>

<style></style>
