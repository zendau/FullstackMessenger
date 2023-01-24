<template>
  <div>
    <button @click="getFreeChatUsersHandler">
      Load free contacts
    </button>
    <ul>
      <li
        v-for="userData in freeUsersList"
        :key="userData.id"
      >
        <div>{{ userData.id }}</div>
        <div>{{ userData.login }}</div>
        <div>{{ userData.lastOnline }}</div>
        <button @click="addChatMember(userData.id)">
          Add
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore, computed, inject } from "vuex";

export default {
  props: {
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
    const store = useStore();

    const chatSocket = inject("chatSocket");
    const freeUsersList = computed(() => store.state.chat.freeChatUsers);

    function getFreeChatUsersHandler() {
      store.dispatch("chat/getFreeChatUsers", {
        userId: props.userId,
        chatId: props.chatData.id,
        users: props.chatData.users,
      });
    }

    function addChatMember(memberId) {
      chatSocket.emit("invite-user", {
        chatId: props.chatData.id,
        userId: memberId,
        users: props.chatData.users,
        adminId: props.chatData.adminId,
      });
    }

    return {
      addChatMember,
      freeUsersList,
      getFreeChatUsersHandler,
    };
  },
};
</script>

<style></style>
