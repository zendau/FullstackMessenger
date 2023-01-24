<template>
  <div v-if="selectedMessages.length">
    <p>{{ selectedMessages.length }}</p>
    <button @click="deleteMessages">
      Deleted
    </button>
    <button @click="selectedMessages = []">
      Cancel
    </button>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  emits: ["delete-messages"],
  setup(_, { emit }) {
    const selectedMessages = inject("selectedMessages");

    function deleteMessages() {
      emit("delete-messages");
    }

    return {
      deleteMessages,
      selectedMessages,
    };
  },
};
</script>

<style></style>
