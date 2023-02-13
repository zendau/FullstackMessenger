<template>
  <div
    v-if="selectedMessages.length"
    style="display: flex"
  >
    <p style="color: white">
      {{ selectedMessages.length }}
    </p>
    <button @click="deleteMessages">
      {{ $t("chat.headerMessages.deleted") }}
    </button>
    <button @click="selectedMessages = []">
      {{ $t("chat.headerMessages.cancel") }}
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
