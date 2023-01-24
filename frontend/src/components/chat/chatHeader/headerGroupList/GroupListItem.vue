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
  emits: ["open-user-info"],
  setup(props, { emit }) {
    const chatSocket = inject("chatSocket");

    function openUserInfo(userId) {
      emit("open-user-info", userId);
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
