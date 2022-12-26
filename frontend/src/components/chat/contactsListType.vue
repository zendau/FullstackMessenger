<template>
  <button
    v-for="(type, key) in listTypes"
    :key="type"
    :class="{ 'contacts__btn--active': listType === key }"
    @click="changeListType(key)"
  >
    {{ type }}
  </button>
</template>

<script>
import { reactive, ref } from "vue";

export default {
  props: ["listType"],
  emits: ["changeListType"],
  setup(_, { emit }) {
    const listTypes = {
      freeUsers: "Add",
      contacts: "Contacts",
      pendingRequests: "Pending",
      outgoingRequests: "Outgoing",
      blockedUsers: "Blocked",
    };

    function changeListType(type) {
      emit("changeListType", type);
    }

    return {
      changeListType,
      listTypes,
    };
  },
};
</script>

<style lang="scss">
.contacts {
  &__btn {
    &--active {
      background-color: blue;
      color: white;
    }
  }
}
</style>
