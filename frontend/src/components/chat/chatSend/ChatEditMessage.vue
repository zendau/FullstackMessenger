<template>
  <p>{{ editTextMessage }}</p>
  <button @click="cancelMessageHandler">
    Cancel
  </button>
</template>

<script>
export default {
  props: {
    editTextMessage: {
      type: String,
      required: true,
    },
  },
  emits: ["cancel-message"],
  setup(_, { emit }) {
    function cancelMessageHandler() {
      emit("cancel-message");
    }

    return {
      cancelMessageHandler,
    };
  },
};
</script>

<style></style>
