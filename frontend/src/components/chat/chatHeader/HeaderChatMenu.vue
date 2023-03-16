<template>
  <div class="header-menu__container">
    <button
      class="header-menu__btn"
      @click="initCallConference"
    >
      <font-awesome-icon
        v-if="!isPrivateBanned"
        :title="$t('chat.headerChatMenu.call')"
        icon="fa-solid fa-phone-volume"
      />
    </button>
    <button
      v-if="adminId && isChatAdmin"
      class="header-menu__btn header-menu__btn--danger"
      @click="isShowConfirmModal = true"
    >
      <font-awesome-icon
        :title="$t('chat.headerChatMenu.deleteChat')"
        icon="fa-solid fa-trash"
      />
    </button>
    <button
      v-else-if="adminId"
      class="header-menu__btn header-menu__btn--danger"
      @click="exitFromChat"
    >
      <font-awesome-icon
        :title="$t('chat.headerChatMenu.exit')"
        icon="fa-solid fa-right-from-bracket"
      />
    </button>
  </div>

  <ConfirmModal
    :is-open-modal="isShowConfirmModal"
    :action-handler="deleteChat"
    :title="$t('chat.headerChatMenu.confirmTitle')"
    @close-confirm-modal="isShowConfirmModal = false"
  />
</template>

<script>
import { ref, inject, computed } from "vue";
import { useI18n } from "vue-i18n";

import ConfirmModal from "@/components/chat/modals/ConfirmModal.vue";

export default {
  components: { ConfirmModal },
  props: {
    isPrivateBanned: {
      type: [String, Boolean],
      required: true,
    },
    adminId: {
      type: [Number, null],
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

    const { t } = useI18n();

    const chatId = inject("chatId");
    const callingData = inject("callingData");

    const isChatAdmin = computed(() => props.adminId === props.userId);

    function initCallConference() {
      console.log("TEST1", props.chatUsers);
      const onlineUsersPeers = Object.values(props.chatUsers).reduce((prev, curr) => {
        if (curr.lastOnline === t("store.user.online") && curr.id !== props.userId) {
          prev.push(curr.peerId);
        }

        return prev;
      }, []);

      console.log("TEST2", onlineUsersPeers);
      if (onlineUsersPeers.length === 0) {
        const audio = new Audio("/audio/disconnect.mp3");
        audio.play();

        return;
      }

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

<style lang="scss" scoped>
.header-menu {
  &__container {
    justify-self: end;
    align-self: center;
  }

  &__btn {
    border: none;
    background-color: inherit;
    margin: 0 20px;
    cursor: pointer;

    &--danger {
      svg {
        color: var(--color-danger) !important;
      }
    }

    svg {
      color: var(--color-icon);
      height: 22px;
      width: 22px;
    }
  }
}
</style>
