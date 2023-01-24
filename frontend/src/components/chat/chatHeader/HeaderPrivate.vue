<template>
  <div @click="openUserInfo(chatData.users[0].id)">
    <h1 class="chat__title">
      Chat - {{ chatTitle }}
    </h1>
    <p>Status - {{ privateChatOnlineStatus }}</p>
  </div>
</template>

<script>
export default {
  props: {
    chatTitle: {
      type: String,
      required: true,
    },
    privateChatOnlineStatus: {
      type: String,
      required: true,
    },
  },
  emits: ["open-user-info"],
  setup(_, { emit }) {
    function openUserInfo(userId) {
      emit("open-user-info", userId);
    }

    return {
      openUserInfo,
    };
  },
};
</script>

<style></style>
