<template>
  <ul
    v-if="Object.keys(listData).length > 0"
    class="contacts__list"
  >
    <li
      v-for="user in listData"
      :key="user.id"
      class="contact__item"
      @click="openUserModal(user.id)"
    >
      <font-awesome-icon
        class="contact__item-icon"
        icon="fa-solid fa-user"
      />
      <p>{{ user.login }}</p>
      <p>{{ user.lastOnline }}</p>
    </li>
  </ul>
  <p
    v-else
    class="empty_message"
  >
    {{ $t("chat.contactsList.noUsers") }}
  </p>
</template>

<script>
import { computed, watch, inject } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const listData = computed(() => store.state.contact.pendingRequests);

    const modalUserId = inject("modalUserId");
    const contactsPattern = inject("contactsPattern");

    watch(
      contactsPattern,
      (pattern, oldPattern) => {
        if (pattern) {
          store.dispatch("contact/getPendingRequests", contactsPattern.value);
          return;
        } else {
          if (oldPattern) {
            store.commit("contact/clearListData", "pendingRequests");
          }
        }

        if (listData.value.length > 0) return;

        store.dispatch("contact/getPendingRequests");
      },
      {
        immediate: true,
      }
    );

    function openUserModal(userId) {
      modalUserId.value = userId;
    }

    return {
      listData,
      openUserModal,
    };
  },
};
</script>

<style></style>
