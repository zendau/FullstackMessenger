<template>
  <li style="margin: 0">
    <div @click="openUserInfo(userData.id)">
      <div>{{ userData.id }}</div>
      <div>{{ userData.login }}</div>
      <div>{{ userData.lastOnline }}</div>
    </div>
    <div v-if="chatData.adminId === userData.id">
      ADMIN
    </div>
    <div v-else-if="chatData.adminId === userId">
      <button
        v-if="isAddedType"
        @click="addChatMember(userData.id, userData.login)"
      >
        Add
      </button>
      <button
        v-else
        @click="deleteChatMember(userData.id, userData.login)"
      >
        Delete
      </button>
    </div>
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

<style></style>
