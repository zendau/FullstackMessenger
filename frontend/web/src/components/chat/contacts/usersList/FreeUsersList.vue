<template>
  <ul
    v-if="Object.keys(listData).length > 0"
    class="contacts__list"
  >
    <li
      v-for="(user, _, index) in listData"
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

    const modalUserId = inject("modalUserId");
    const contactsPattern = inject("contactsPattern");

    const observer = new IntersectionObserver(async (entries) => {

      if (entries[0].isIntersecting && !contactsPattern.value) {
        store.dispatch("contact/getFreeUsersList");
      }
    });

    watch(
      contactsPattern,
      (pattern, oldPattern) => {

        if (pattern) {
          store.dispatch("contact/getFreeUsersList", contactsPattern.value);
          return;
        } else {
          if (oldPattern) {
            store.commit("contact/clearListData", "freeUsers");
          }
        }

        store.dispatch("contact/getFreeUsersList");
      },
      {
        immediate: true,
      }
    );

    function setObserver(el, index) {
      if (index != Object.keys(listData.value).length - 1) return;
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
