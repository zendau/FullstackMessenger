<template>
  <p
    v-if="userLogin"
    class="chat__pressing"
  >
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
