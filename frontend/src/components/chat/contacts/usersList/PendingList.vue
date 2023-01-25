<template>
  <ul class="contacts__list">
    <li
      v-for="user in listData"
      :key="user.id"
      class="contact__item"
      @click="openUserModal(user.id)"
    >
      <i class="bi bi-person" />
      <p>{{ user.login }}</p>
      <p>{{ user.lastOnline }}</p>
    </li>
  </ul>
  <p
    v-if="listData.length === 0"
    class="empty_message"
  >
    No users
  </p>
</template>

<script>
import { computed, watch, inject } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const listData = computed(() => store.state.contact.pendingRequests);
    const userId = computed(() => store.state.auth.user.id);

    const modalUserId = inject("modalUserId");
    const contactsPattern = inject("contactsPattern");

    watch(
      contactsPattern,
      (pattern, oldPattern) => {
        console.log("WATCH");
        if (pattern) {
          store.dispatch("contact/getPendingRequests", {
            userId: userId.value,
            pattern: contactsPattern.value,
          });
          return;
        } else {
          if (oldPattern) {
            store.commit("contact/clearListData", "pendingRequests");
          }
        }

        if (listData.value.length > 0) return;

        store.dispatch("contact/getPendingRequests", { userId: userId.value });
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
