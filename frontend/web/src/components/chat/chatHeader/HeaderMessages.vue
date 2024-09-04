<template>
  <div
    v-if="selectedMessages.length"
    class="header-messages__container"
  >
    <p class="header-messages__title">
      {{ $t("chat.headerMessages.selected", selectedMessages.length) }}
    </p>
    <button
      class="header-messages__btn header-messages__btn--danger"
      @click="deleteMessages"
    >
      {{ $t("chat.headerMessages.deleted") }}
    </button>
    <button
      class="header-messages__btn"
      @click="selectedMessages = []"
    >
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

<style lang="scss" scoped>
.header-messages {
  &__title {
    color: var(--color-primary);
    justify-self: start;
  }
  &__container {
    display: grid;
    width: 100%;
    grid-column: 1/3;
    justify-items: center;
    align-items: center;
    grid-template-columns: 1fr 130px 130px;
  }

  &__btn {
    grid-column: 3/4;
    color: var(--color-primary);
    background-color: var(--button-chat-color);
    padding: 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: 0.3s ease;

    &--danger {
      grid-column: 2/3;
      color: var(--color-danger);
    }

    &:hover {
      background-color: var(--button-chat-hover);
    }
  }
}
</style>
