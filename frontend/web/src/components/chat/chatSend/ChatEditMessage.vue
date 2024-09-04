<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="chat__edit-container">
    <h3 class="chat__edit-title">
      Редактирование
    </h3>
    <p
      class="chat__edit-text"
      v-html="editTextMessage"
    />
  </div>

  <button
    class="chat__cancel-btn"
    @click="cancelMessageHandler"
  >
    <font-awesome-icon
      :title="$t('chat.chatEditMessage.cancel')"
      icon="fa-solid fa-xmark"
    />
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

<style lang="scss" scoped>
.chat {
  &__cancel-btn {
    border: none;
    background-color: inherit;
    width: fit-content;
    height: fit-content;
    justify-self: center;
    align-self: center;
    grid-row: 2/3;
    svg {
      color: var(--color-icon);
      height: 25px;
      width: 25px;
      cursor: pointer;
    }
  }

  &__edit {
    &-container {
      padding: 10px;
      grid-row: 2/3;
    }

    &-text {
      padding: 5px 0;
      max-width: 100%;
      display: flex;
      max-height: 300px;
      overflow: auto;
      overflow-wrap: anywhere;
    }
  }

  &__edit-title {
    color: var(--color-links-active);
    font-size: 16px;
  }
}
</style>
