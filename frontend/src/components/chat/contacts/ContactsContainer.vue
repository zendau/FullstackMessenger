<template>
  <div
    class="chat__contacts"
    :class="{ 'chat__contacts--active': !isShowMobileMessages }"
  >
    <!-- <button class="btn" @click="groupType = !groupType">
      {{ groupType ? "Close" : "Create group" }}
    </button> -->
    <SearchCreateGroup @search-pattern="searchContacts" />
    <div style="display: flex">
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
    <!-- <create-group v-if="groupType" :groupUsers="groupUsers" :adminId="userId" /> -->
  </div>
</template>

<script>
import { computed, inject, provide, ref, watch } from "vue";

import { useStore } from "vuex";

import ContactsList from "@/components/chat/contacts/usersList/ContactsList.vue";
import FreeUsersList from "@/components/chat/contacts/usersList/FreeUsersList.vue";
import PendingList from "@/components/chat/contacts/usersList/PendingList.vue";
import OutgoingList from "@/components/chat/contacts/usersList/OutgoingList.vue";
import BlockedList from "@/components/chat/contacts/usersList/BlockedList.vue";
import ContactsListType from "@/components/chat/contacts/ContactsListType.vue";
import SearchCreateGroup from "@/components/chat/SearchCreateGroup.vue";

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

    const isShowMobileMessages = inject("isShowMobileMessages");

    const contacts = computed(() => store.state.chat.constacts);

    const groupUsers = ref([]);

    const pattern = ref(null);
    const userId = computed(() => store.state.auth.user.id);

    const chatSocket = inject("chatSocket");

    provide("contactsPattern", pattern);

    const createGroupUsers = inject("createGroupUsers");

    store.dispatch("contact/getContactCount", userId);

    chatSocket.on("changeContactStatus", (data) => {
      console.log("data", data);
      store.commit("contact/changeContactStatus", data);
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
    padding-top: 10px;
    background-color: var(--bgcColor);

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
      background-color: blue;
      color: white;
    }
  }

  &__list {
    overflow: auto;
    margin-top: 12.5px;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #3f4750;
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9b9fa4;
      box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
      border-radius: 10px;
    }
  }
}

.contact {
  &__item {
    display: flex;
    align-items: center;
    transition: 0.3s ease;
    cursor: pointer;
    color: var(--textColor);
    padding: 14px 0;

    a {
      padding: 14.5px 0;
    }

    &:hover {
      background-color: var(--itemColor);
    }

    input {
      margin: 0 5px;
    }

    i {
      margin: 0 10px;
      font-size: 26px;
    }
  }
}
</style>
