<template>
  <h1
    class="chat__title chat__title--private"
    @click="toggleUsersList"
  >
    {{ chatTitle }}
  </h1>
  <p
    class="chat__count"
    @click="toggleUsersList"
  >
    {{ $t("chat.headerGroup.members", membersCount) }}
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

<style lang="scss" scoped>
.chat {
  &__count {
    color: var(--color-secondary);
  }
}
</style>
