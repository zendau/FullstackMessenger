<template>
  <h1 class="chat__title chat__title--private">
    Group - {{ chatTitle }}
  </h1>
  <p @click="toggleUsersList">
    Members - {{ membersCount }}
  </p>
</template>

<script>
export default {
  props: {
    chatTitle: {
      type: String,
      required: true,
    },
    membersCount: {
      type: Number,
      required: true,
    },
  },
  emits: ["toggle-list"],
  setup(_, { emit }) {
    function toggleUsersList() {
      emit("toggle-list");
    }

    return {
      toggleUsersList,
    };
  },
};
</script>

<style></style>
