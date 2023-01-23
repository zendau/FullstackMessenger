<template>
  <ul class="contacts__list">
    <li
      v-for="(user, index) in listData"
      :key="user.id"
      :ref="(el) => setObserver(el, index)"
    >
      <div
        class="contact__item"
        @contextmenu.prevent
        @click.left="openChat(user)"
        @click.right="openUserModal(user.id)"
      >
        <i class="bi bi-person" />

        <p>{{ user.login }}</p>
        <p>{{ user.lastOnline }}</p>
      </div>
      <input
        v-if="createGroupUsers.length > 0"
        v-model="createGroupUsers"
        :value="user.id"
        type="checkbox"
      >
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
import { computed, inject, ref, watch } from "vue";
import { useStore } from "vuex";

export default {
  props: ["count"],
  emits: ["openChat"],
  setup(_, { emit }) {
    const store = useStore();
    const listData = computed(() => store.state.contact.contacts);
    const userId = computed(() => store.state.auth.user.id);

    const modalUserId = inject("modalUserId");
    const contactsPattern = inject("contactsPattern");
    const createGroupUsers = inject("createGroupUsers");

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

    function openChat(userData) {
      console.log("CHAT", userData)
      emit("openChat", userData.chat ?? 'contact');
      store.commit("chat/setTempPrivateChat", {
        id: userData.id,
        title: userData.login,
        lastOnline: userData.lastOnline,
      });
      console.log("open chat", userData.chat);
    }

    function openUserModal(userId) {
      modalUserId.value = userId;
    }

    return {
      openChat,
      createGroupUsers,
      contactsPattern,
      listData,
      openUserModal,
      setObserver,
    };
  },
};
</script>

<style></style>
