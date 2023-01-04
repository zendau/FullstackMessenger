<template>
  <div
    class="chat__contacts"
    :class="{ 'chat__contacts--active': !isShowMobileMessages }"
  >
    <!-- <button class="btn" @click="groupType = !groupType">
      {{ groupType ? "Close" : "Create group" }}
    </button> -->
    <input type="text" @input="searchContacts" />
    <div style="display: flex">
      <ContactsListType :listType="listType" @changeListType="changeListType" />
    </div>
    <ContactsList v-if="listType === 'contacts'" />
    <FreeUsersList v-else-if="listType === 'freeUsers'" />
    <PendingList v-else-if="listType === 'pendingRequests'" />
    <OutgoingList v-else-if="listType === 'outgoingRequests'" />
    <BlockedList v-else-if="listType === 'blockedUsers'" />
    <!-- <create-group v-if="groupType" :groupUsers="groupUsers" :adminId="userId" /> -->
  </div>
</template>

<script>
//import { ref } from "vue";
import $api from "../../axios";

import { useRouter } from "vue-router";

import { computed, inject, provide, ref } from "vue";
import createGroup from "./createGroup.vue";

import { useStore } from "vuex";

import ContactsList from "./contacts/contactsList.vue";
import FreeUsersList from "./contacts/freeUsersList.vue";
import PendingList from "./contacts/pendingList.vue";
import OutgoingList from "./contacts/outgoingList.vue";
import BlockedList from "./contacts/blockedList.vue";

import ContactsListType from "./contactsListType.vue";

import debounce from "../../utils/debounce";

export default {
  components: {
    createGroup,
    ContactsList,
    FreeUsersList,
    PendingList,
    OutgoingList,
    BlockedList,
    ContactsListType,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const listType = ref("contacts");

    const isShowMobileMessages = inject("isShowMobileMessages");

    const userData = computed(() => store.state.auth.user);
    const contacts = computed(() => store.state.chat.constacts);

    const listData = computed(() => store.state.contact[listType.value]);

    const groupUsers = ref([]);

    const login = userData.value.login;

    const scrollEnd = ref(null);
    const pattern = ref(null);
    const userId = userData.value.id;

    const chatSocket = inject("chatSocket");

    provide("contactsPattern", pattern);

    store.dispatch("contact/getContactCount", userId);

    chatSocket.on("changeContactStatus", (data) => {
      store.commit("contact/changeContactStatus", data);
      console.log("data", data);
    });

    const searchContacts = debounce((el) => {
      pattern.value = el.target.value;
      // if (pattern.length === 0) {
      //   searchData.value = null;
      //   return;
      // }

      // console.log({
      //   userId: userId.value,
      //   pattern,
      // });

      // chatSocket.emit("serchChats", {
      //   userId: userId.value,
      //   pattern,
      // });
    });

    //store.dispatch('chat/getContacts')

    const groupType = ref(false);

    const roomName = ref("");
    console.log("CALL DISPATCH");

    function changeListType(type) {
      listType.value = type;
    }

    async function openUserChat(id) {
      if (groupType.value) return;

      const res = await $api.post("/chat/check", {
        adminId: userId,
        users: [id],
      });

      if (res.data.status) {
        router.push(`/chat/${res.data.id}`);
      } else {
        console.log("create");
        const chatData = await $api.post("/chat/create", {
          adminId: userId,
          users: [id],
        });

        const chatId = chatData.data.id;

        router.push(`/chat/${chatId}`);
      }
    }

    // store.dispatch("contact/getContactsList", userId);
    // store.dispatch("contact/getFreeUsersList", userId);
    // store.dispatch("contact/getPendingRequests", userId);
    // store.dispatch("contact/getOutgoingRequests", userId);
    // store.dispatch("contact/getBlockedUsers", userId);

    async function createGroupChat() {
      console.log("groupCreate");
      const chatData = await $api.post("/chat/create", {
        adminId: parseInt(userId),
        groupName: roomName.value,
        users: [...groupUsers.value],
      });

      if (chatData.data) {
        router.push(`/chat/${chatData.data.id}`);
      }
    }

    return {
      login,
      contacts,
      groupType,
      groupUsers,
      userId,
      roomName,
      listType,
      listData,
      isShowMobileMessages,
      scrollEnd,
      searchContacts,
      pattern,
      changeListType,
      openUserChat,
      createGroupChat,
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
