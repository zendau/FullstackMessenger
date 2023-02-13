<template>
  <p v-if="userLogin">
    {{ userLogin }} {{ $t("chat.chatPressing.pressing") }}
  </p>
</template>

<script>
export default {
  props: {
    userLogin: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script>

<style></style>
