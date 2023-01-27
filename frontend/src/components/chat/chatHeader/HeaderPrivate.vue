<template>
  <div @click="openUserInfo">
    <h1 class="chat__title">
      Chat - {{ chatTitle }}
    </h1>
    <p>Status - {{ privateChatOnlineStatus }}</p>
  </div>
</template>

<script>
import { inject } from "vue";

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
    privateUserId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const modalUserId = inject("modalUserId");

    function openUserInfo() {
      if (props.privateUserId === props.userId) return;

      modalUserId.value = props.privateUserId;
    }

    return {
      openUserInfo,
    };
  },
};
</script>

<style></style>
