<template>
  <button
    v-for="(type, key) in listTypes"
    :key="type"
    class="contacts__btn"
    :class="{ 'contacts__btn--active': listType === key }"
    @click="changeListType(key)"
  >
    {{ type }}
    <div v-if="key !== 'freeUsers'">
      {{ contactsCount[key] }}
    </div>
  </button>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import { useI18n } from "vue-i18n";

export default {
  props: {
    listType: {
      type: String,
      required: true,
    },
  },
  emits: ["change-list-type"],
  setup(_, { emit }) {
    const store = useStore();

    const { t } = useI18n();

    const contactsCount = computed(() => store.state.contact.contactsCount);

    const listTypes = {
      freeUsers: t("chat.contactType.freeUsers"),
      contacts: t("chat.contactType.contacts"),
      pendingRequests: t("chat.contactType.pendingRequests"),
      outgoingRequests: t("chat.contactType.outgoingRequests"),
      blockedUsers: t("chat.contactType.blockedUsers"),
    };

    function changeListType(type) {
      emit("change-list-type", type);
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
    height: 40px;
    color: var(--color-primary);
    background-color: var(--color-background-active);
    cursor: pointer;
    border: none;
    margin: 2px;
    font-size: 15px;
    width: 100%;

    div {
      color: var(--color-secondary);
    }

    &--active {
      background-color: var(--button-primary);
    }
  }
}
</style>
