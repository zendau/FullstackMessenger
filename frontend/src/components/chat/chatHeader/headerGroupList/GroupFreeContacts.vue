<template>
  <div>
    <button @click="getFreeChatUsersHandler">
      Load free contacts
    </button>
    <ul>
      <GroupListItem
        v-for="userData in freeUsersList"
        :key="userData.id"
        :user-data="userData"
        :chat-data="chatData"
        :user-id="userId"
      />
    </ul>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useStore } from "vuex";

import GroupListItem from "@/components/chat/chatHeader/headerGroupList/GroupListItem.vue";

export default {
  components: { GroupListItem },
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
