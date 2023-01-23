<template>
  <button
    v-for="(type, key) in listTypes"
    :key="type"
    :class="{ 'contacts__btn--active': listType === key }"
    @click="changeListType(key)"
  >
    {{ type }}
    <div v-if="key !== 'freeUsers'">
      ({{ contactsCount[key] }})
    </div>
  </button>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  props: ["listType"],
  emits: ["changeListType"],
  setup(_, { emit }) {
    const store = useStore();

    const contactsCount = computed(() => store.state.contact.contactsCount);

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
      contactsCount,
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
