<template>
  <li class="group-list__item">
    <div @click="openUserInfo(userData.id)">
      <p>{{ userData.login }}</p>
      <p>{{ userData.lastOnline }}</p>
    </div>
    <p
      v-if="chatData.adminId === userData.id"
      class="group-list__item-admin"
    >
      {{ $t("chat.groupListItem.admin") }}
    </p>
    <template v-else-if="chatData.adminId === userId">
      <button
        v-if="isAddedType"
        @click="addChatMember(userData.id, userData.login)"
      >
        {{ $t("chat.groupListItem.add") }}
      </button>
      <button
        v-else
        @click="deleteChatMember(userData.id, userData.login)"
      >
        {{ $t("chat.groupListItem.delete") }}
      </button>
    </template>
  </li>
</template>

<script>
import { inject } from "vue";

export default {
  props: {
    userData: {
      type: Object,
      required: true,
    },
    chatData: {
      type: Object,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    isAddedType: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const chatSocket = inject("chatSocket");
    const contactId = inject("modalUserId");

    function openUserInfo() {
      if (props.userData.id === props.userId) return;

      contactId.value = props.userData.id;
    }

    function deleteChatMember(memberId, memberLogin) {
      chatSocket.emit("remove-user", {
        chatId: props.chatData.id,
        userId: memberId,
        userLogin: memberLogin,
        users: Object.values(props.chatData.users),
        adminId: props.userId,
      });
    }

    function addChatMember(memberId, memberLogin) {
      chatSocket.emit("invite-user", {
        chatId: props.chatData.id,
        userId: memberId,
        userLogin: memberLogin,
        users: Object.values(props.chatData.users),
        adminId: props.userId,
      });
    }

    return {
      deleteChatMember,
      openUserInfo,
      addChatMember,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-list {
  &__item {
    margin: 0;
    display: grid;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: 250px 100px;
    margin: 5px;
    cursor: pointer;

    p {
      text-align: center;
    }

    &-admin {
      color: var(--color-secondary);
    }

    button,
    &-admin {
      grid-column: 2/3;
    }
    button {
      background-color: var(--button-chat-color);
      transition: 0.3s ease;
      cursor: pointer;
      border: none;
      padding: 5px;
      color: var(--color-primary);

      &:hover {
        background-color: var(--button-chat-hover);
      }
    }
  }
}
</style>
