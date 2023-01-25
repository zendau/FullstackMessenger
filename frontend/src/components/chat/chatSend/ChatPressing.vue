<template>
  <p v-if="userLogin">
    {{}} is pressing ...
  </p>
</template>

<script>
export default {
  props: {
    userLogin: {
      type: String,
      required: true,
    },
  },
};
</script>

<style></style>
