<template>
  <ul class="contacts__list">
    <li
      class="contact__item"
      v-for="(user, index) in listData"
      :key="user.id"
      @click="openUserModal(user.id)"
      :ref="(el) => setObserver(el, index)"
    >
      <i class="bi bi-person"></i>
      <!-- <input
        v-if="groupType"
        v-model="groupUsers"
        :value="user.id"
        type="checkbox"
      /> -->
      <p>{{ user.login }}</p>
      <p>{{ user.lastOnline }}</p>
    </li>
  </ul>
  <p class="empty_message" v-if="listData.length === 0">No users</p>
</template>

<script>
import { computed, inject, watch } from "vue";
import { useStore } from "vuex";

export default {
  props: ["count"],
  setup() {
    const store = useStore();
    const listData = computed(() => store.state.contact.contacts);
    const userId = computed(() => store.state.auth.user.id);

    const modalUserId = inject("modalUserId");
    const contactsPattern = inject("contactsPattern");

    const observer = new IntersectionObserver(async (entries) => {
      console.log("contacts", entries[0], contactsPattern.value);
      if (entries[0].isIntersecting && !contactsPattern.value) {
        console.log("observer getContactsList");
        store.dispatch("contact/getContactsList", { userId: userId.value });
      }
    });

    console.log("setup");

    watch(
      contactsPattern,
      (pattern, oldPattern) => {
        if (pattern) {
          store.dispatch("contact/getContactsList", {
            userId: userId.value,
            pattern: contactsPattern.value,
          });
          return;
        } else {
          if (oldPattern) {
            store.commit("contact/clearListData", "contacts");
          }
        }
        store.dispatch("contact/getContactsList", { userId: userId.value });
      },
      {
        immediate: true,
      }
    );

    function setObserver(el, index) {
      if (index !== listData.value.length - 1) return;
      if (!el) return;
      console.log("set last contacts");
      observer.observe(el);
    }

    function openUserModal(userId) {
      modalUserId.value = userId;
    }

    return {
      contactsPattern,
      listData,
      openUserModal,
      setObserver,
    };
  },
};
</script>

<style></style>
