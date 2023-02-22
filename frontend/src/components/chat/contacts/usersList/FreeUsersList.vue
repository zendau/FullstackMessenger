<template>
  <ul
    v-if="Object.keys(listData).length > 0"
    class="contacts__list"
  >
    <li
      v-for="(user, index) in listData"
      :key="user.id"
      :ref="(el) => setObserver(el, index)"
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
      observer.disconnect();
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
