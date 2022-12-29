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
import { computed, watch, inject } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const listData = computed(() => store.state.contact.freeUsers);
    const userId = computed(() => store.state.auth.user.id);

    const modalUserId = inject("modalUserId");
    const contactsPattern = inject("contactsPattern");

    const observer = new IntersectionObserver(async (entries) => {
      console.log("free", entries[0]);
      if (entries[0].isIntersecting && !contactsPattern.value) {
        store.dispatch("contact/getFreeUsersList", { userId: userId.value });
      }
    });

    watch(
      contactsPattern,
      (pattern, oldPattern) => {
        console.log("pattern", pattern);

        if (pattern) {
          store.dispatch("contact/getFreeUsersList", {
            userId: userId.value,
            pattern: contactsPattern.value,
          });
          return;
        } else {
          if (oldPattern) {
            store.commit("contact/clearListData", "freeUsers");
          }
        }

        store.dispatch("contact/getFreeUsersList", { userId: userId.value });
      },
      {
        immediate: true,
      }
    );

    function setObserver(el, index) {
      if (index !== listData.value.length - 1) return;
      if (!el) return;
      observer.observe(el);
    }

    function openUserModal(userId) {
      modalUserId.value = userId;
    }

    return {
      listData,
      openUserModal,
      setObserver,
    };
  },
};
</script>

<style></style>
