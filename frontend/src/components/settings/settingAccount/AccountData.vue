<template>
  <h1 class="user__title">
    Hello {{ login }}
  </h1>
  <p class="user__text">
    Email: {{ email }}
  </p>
  <p class="user__text">
    Role: {{ role }}
  </p>
</template>

<script>
export default {
  props: {
    login: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
};
</script>

<style></style>
