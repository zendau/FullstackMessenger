<template>
  <ul
    v-if="Object.keys(listData).length > 0"
    class="contacts__list"
  >
    <li
      v-for="(user, _, index) in listData"
      :key="user.id"
      :ref="(el) => setObserver(el, index)"
    >
      <div
        class="contact__item"
        @contextmenu.prevent
        @click.left="checkPrivateContact(user)"
        @click.right="openUserModal(user.id)"
      >
        <font-awesome-icon
          class="contact__item-icon"
          icon="fa-solid fa-user"
        />

        <p>{{ user.login }}</p>
        <p>{{ user.lastOnline }}</p>
      </div>
      <input
        v-if="createGroupUsers.length > 0"
        v-model="createGroupUsers"
        class="contact__checkbox"
        :value="user.id"
        type="checkbox"
      />
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
import { computed, inject, watch } from "vue";
import { useStore } from "vuex";

export default {
  emits: ["open-chat"],
  setup(_, { emit }) {
    const store = useStore();
    const listData = computed(() => store.state.contact.contacts);

    const modalUserId = inject("modalUserId");
    const contactsPattern = inject("contactsPattern");
    const createGroupUsers = inject("createGroupUsers");

    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && !contactsPattern.value) {
        store.dispatch("contact/getContactsList");
      }
    });

    watch(
      contactsPattern,
      (pattern, oldPattern) => {
        if (pattern) {
          store.dispatch("contact/getContactsList", contactsPattern.value);
          return;
        } else {
          if (oldPattern) {
            store.commit("contact/clearListData", "contacts");
          }
        }
        store.dispatch("contact/getContactsList");
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

    function checkPrivateContact(contactData) {
      store.dispatch("chat/getPrivateChatId", { contactData, openChat });
    }

    function openChat(chatId) {
      emit("open-chat", chatId);
    }

    function openUserModal(userId) {
      modalUserId.value = userId;
    }

    return {
      checkPrivateContact,
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
