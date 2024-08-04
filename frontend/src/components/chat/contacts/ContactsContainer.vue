<template>
  <div
    class="chat__contacts"
    :class="{ 'chat__contacts--active': !isShowMobileMessages }"
  >
    <SearchCreateGroup @search-pattern="searchContacts" />
    <div class="contacts__container">
      <ContactsListType
        :list-type="listType"
        @change-list-type="changeListType"
      />
    </div>
    <ContactsList
      v-if="listType === 'contacts'"
      @open-chat="openChat"
    />
    <FreeUsersList v-else-if="listType === 'freeUsers'" />
    <PendingList v-else-if="listType === 'pendingRequests'" />
    <OutgoingList v-else-if="listType === 'outgoingRequests'" />
    <BlockedList v-else-if="listType === 'blockedUsers'" />
  </div>
</template>

<script>
import { computed, inject, onUnmounted, provide, ref, watch } from "vue";

import { useStore } from "vuex";

import ContactsList from "@/components/chat/contacts/usersList/ContactsList.vue";
import FreeUsersList from "@/components/chat/contacts/usersList/FreeUsersList.vue";
import PendingList from "@/components/chat/contacts/usersList/PendingList.vue";
import OutgoingList from "@/components/chat/contacts/usersList/OutgoingList.vue";
import BlockedList from "@/components/chat/contacts/usersList/BlockedList.vue";
import ContactsListType from "@/components/chat/contacts/ContactsListType.vue";
import SearchCreateGroup from "@/components/chat/SearchCreateGroup/SearchCreateGroup.vue";

export default {
  components: {
    ContactsList,
    FreeUsersList,
    PendingList,
    OutgoingList,
    BlockedList,
    ContactsListType,
    SearchCreateGroup,
  },
  emits: ["open-chat"],
  setup(_, { emit }) {
    const store = useStore();

    const listType = ref("contacts");

    const isShowMobileMessages = inject("isShowMobileMessages", false);

    const contacts = computed(() => store.state.chat.constacts);

    const groupUsers = ref([]);

    const pattern = ref(null);
    const userId = computed(() => store.state.auth.user.id);

    const chatSocket = inject("chatSocket");

    provide("contactsPattern", pattern);

    const createGroupUsers = inject("createGroupUsers");

    store.dispatch("contact/getContactCount");

    console.log("on contact");
    chatSocket.on("contact", (userStatus) => {
      console.log("USER sttaa", userStatus);
      store.commit("users/updateUserOnline", userStatus);
    });

    onUnmounted(() => {
      console.log("unmounted");
      chatSocket.removeAllListeners("contact");
    });

    watch(
      createGroupUsers,
      (value) => {
        if (value.length !== 1) return;
        listType.value = "contacts";
      },
      {
        deep: true,
      }
    );

    const searchContacts = (value) => {
      pattern.value = value;
    };

    const groupType = ref(false);

    function changeListType(type) {
      listType.value = type;
    }

    function openChat(chatId) {
      emit("open-chat", chatId);
    }

    return {
      contacts,
      groupType,
      groupUsers,
      userId,
      listType,
      isShowMobileMessages,
      searchContacts,
      pattern,
      changeListType,
      openChat,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__contacts {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
    box-sizing: border-box;
    background-color: var(--color-background);

    button {
      margin-bottom: 10px;
      width: 100px;
      align-self: center;
    }
  }
}

.contacts {
  &__btn {
    &--active {
      background-color: var(--button-primary);
      color: var(--color-primary);
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
  }

  &__list {
    overflow: auto;

    li {
      position: relative;
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--scrollbarTrack);
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(-scrollbarThumb);
      box-shadow: inset 2px 2px 5px 0 rgba(var(--color-primary), 0.5);
      border-radius: 10px;
    }
  }
}

@media (max-width: 720px) {
  .chat {
    &__contacts {
      max-height: initial;
    }
  }
}
</style>

<style lang="scss">
.contact {
  &__item {
    color: var(--color-primary);
    display: grid;
    grid-template-columns: 30px 1fr;
    grid-template-rows: 40px 1fr;
    justify-items: center;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    transition: 0.3s ease;

    &:hover {
      background-color: var(--color-background-item);
    }

    &-icon {
      grid-row: 1/3;
      height: 25px;
      width: 25px;
      padding: 5px;
    }

    p:nth-child(3) {
      grid-column: 2/3;
    }
  }

  &__checkbox {
    position: absolute;
    top: 0;
    right: 0;
    height: 22px;
    width: 22px;
  }
}

.contacts__list {
  li {
    position: relative;
  }
}
</style>
