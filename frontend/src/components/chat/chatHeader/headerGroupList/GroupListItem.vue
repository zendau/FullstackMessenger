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
    <button
      v-else-if="chatData.adminId === userId"
      @click="deleteChatMember(userData.id)"
    >
      Delete
    </button>
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
  },
  setup(props) {
    const chatSocket = inject("chatSocket");
    const contactId = inject("modalUserId");

    function openUserInfo() {
      if (props.userData.id === props.userId) return;

      contactId.value = props.userData.id;
    }

    function deleteChatMember(memberId) {
      chatSocket.emit("remove-user", {
        chatId: props.chatData.id,
        userId: memberId,
        users: props.chatData.users,
        adminId: props.userData.id,
      });
    }

    return {
      deleteChatMember,
      openUserInfo,
    };
  },
};
</script>

<style></style>
