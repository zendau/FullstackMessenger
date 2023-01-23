<template>
  <div class="chat__header">
    <div v-if="selectedMessages.length">
      <p>{{ selectedMessages.length }}</p>
      <button @click="deleteMessages">
        Deleted
      </button>
      <button @click="selectedMessages = []">
        Cancel
      </button>
    </div>
    <div class="chat__header-data">
      <div v-if="chatData?.adminId">
        <h1 class="chat__title chat__title--private">
          Group - {{ chatData.title }}
        </h1>
        <p @click="isShowUsersList = !isShowUsersList">
          Members - {{ chatGroupMembersCount }}
        </p>
      </div>
      <div
        v-else
        @click="openUserInfo(chatData.users[0].id)"
      >
        <h1 class="chat__title">
          Chat - {{ chatData.title }}
        </h1>
        <p>Status - {{ privateChatOnlineStatus }}</p>
      </div>
      <!-- <p class="chat__count" v-if="groupUsers" @click="showUsers = !showUsers">
        {{ groupUsers.length }} peoples
      </p> -->
      <!-- <NavbarUserList :users="groupUsers" :show="showUsers" /> -->
    </div>

    <div v-if="chatData?.adminId">
      <button
        v-if="isChatAdmin"
        class="chat__exit"
        @click="isShowConfirmModal = true"
      >
        Delete chat
      </button>
      <button
        v-else
        class="chat__exit"
        @click="exitFromChat"
      >
        Exit chat
      </button>
    </div>
    <div
      v-if="isChatAdmin"
      class="chat__topbar"
    >
      <!-- <div class="chat__user-group">
        <button class="btn" @click="showAddUsers = !showAddUsers">
          <i class="bi bi-person-plus-fill"></i>
        </button>
        <NavbarUserList
          :users="invaitedUsers"
          :show="showAddUsers"
          @selectUser="addUserToChat"
        />
      </div> -->
      <!-- <div class="chat__user-group">
        <button
          class="chat__add-group btn"
          @click="showRemoveUsers = !showRemoveUsers"
        >
          <i class="bi bi-person-dash-fill"></i>
        </button>
        <NavbarUserList
          :users="removeUsersList"
          :show="showRemoveUsers"
          @selectUser="removeUserFromChat"
        />
      </div> -->
    </div>
  </div>
  <div
    v-if="isShowUsersList"
    style="color: white; height: 400px; overflow: auto"
  >
    <ul style="margin: 0">
      <li
        v-for="userData in chatData.users"
        :key="userData.id"
        style="margin: 0"
      >
        <div @click="openUserInfo(userData.id)">
          <div>{{ userData.id }}</div>
          <div>{{ userData.login }}</div>
          <div>{{ userData.lastOnline }}</div>
        </div>
        <div v-if="chatData.adminId === userData.id">
          ADMIN
        </div>
        <button
          v-else-if="chatData.adminId === mainUserData.id"
          @click="deleteChatMember(userData.id)"
        >
          Delete
        </button>
      </li>
    </ul>

    <div v-if="chatData.adminId === mainUserData.id">
      <button @click="getFreeChatUsersHandler">
        Load free contacts
      </button>
      <ul>
        <li
          v-for="userData in freeUsersList"
          :key="userData.id"
        >
          <div>{{ userData.id }}</div>
          <div>{{ userData.login }}</div>
          <div>{{ userData.lastOnline }}</div>
          <button @click="addChatMember(userData.id)">
            Add
          </button>
        </li>
      </ul>
    </div>
  </div>
  <ConfirmModal
    :is-open-modal="isShowConfirmModal"
    :action-handler="deleteChat"
    :title="'Delete selected chat ?'"
    @closeConfirmModal="isShowConfirmModal = false"
  />
</template>

<script>
import { computed, inject, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import NavbarUserList from "./navbarUserList.vue";
import ConfirmModal from "./confirmModal.vue";

export default {
  components: { NavbarUserList, ConfirmModal },
  emits: ["deleteMessages"],
  setup(_, { emit }) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const chatId = computed(() => route.params.id);
    const chatData = inject("chatData");
    const userData = computed(() => store.state.auth.user);

    const selectedMessages = inject("selectedMessages");

    const isChatAdmin = computed(
      () => chatData.value.adminId === userData.value.id
    );

    const showUsers = ref(false);
    const showAddUsers = ref(false);
    const showRemoveUsers = ref(false);

    const modalUserId = inject("modalUserId");

    // const groupUsers = computed(() => store.state.chat.chatData.group);
    const groupUsers = null;
    const removeUsersList = computed(
      () => store.getters["chat/getRemoveUserList"]
    );
    const freeUsersList = computed(() => store.state.chat.freeChatUsers);

    const chatSocket = inject("chatSocket");

    const privateChatOnlineStatus = computed(() => {
      if (!chatData.value?.users) return chatData.value.lastOnline;

      const userId = Object.keys(chatData.value.users)[0];
      return chatData.value.users[userId].lastOnline;
    });

    const chatGroupMembersCount = computed(
      () => Object.keys(chatData.value.users).length
    );

    const isShowUsersList = ref(false);
    const isShowConfirmModal = ref(false);

    function exitFromChat() {
      console.log("exit from chat");
      chatSocket.emit("exit-chat", {
        chatId: chatId.value,
        userId: userData.value.id,
        users: chatData.value.users,
        adminId: null,
      });
    }

    function deleteChat() {
      chatSocket.emit('deleteChat', {
        chatId: chatId.value,
        adminId: userData.value.id
      })
      console.log("detele chat");
    }

    // async function exitGroup() {
    //   console.log("exit user with id ", userId);
    //   const res = await $api.delete("/chat/exitUser", {
    //     chatId: chatId.value,
    //     userId,
    //   });
    //   store.state.chat.chats = store.state.chat.chats.filter(
    //     (chat) => chat.chatId !== chatId.value
    //   );
    //   store.commit("chat/cleanMessages");
    //   store.commit("chat/cleanChatData");
    //   chatSocket.emit("userLeave", {
    //     roomId: chatId.value,
    //     userId,
    //   });
    //   if (res.data) {
    //     router.push("/chat");
    //   }
    // }

    function getFreeChatUsersHandler() {
      store.dispatch("chat/getFreeChatUsers", {
        userId: userData.value.id,
        chatId: chatId.value,
        users: chatData.value.users,
      });
    }

    function deleteMessages() {
      emit("deleteMessages");
    }

    function deleteChatMember(memberId) {
      console.log("delete from chat", chatId.value, "user with id ", memberId);
      chatSocket.emit("remove-user", {
        chatId: chatId.value,
        userId: memberId,
        users: chatData.value.users,
        adminId: userData.value.id,
      });
    }

    function addChatMember(memberId) {
      chatSocket.emit("invite-user", {
        chatId: chatId.value,
        userId: memberId,
        users: chatData.value.users,
        adminId: userData.value.id,
      });
    }

    function openUserInfo(userId) {
      if (userData.value.id === userId) return;

      modalUserId.value = userId;
    }

    return {
      chatData,
      openUserInfo,
      showUsers,
      showAddUsers,
      showRemoveUsers,
      isChatAdmin,
      groupUsers,
      removeUsersList,
      selectedMessages,
      privateChatOnlineStatus,
      isShowUsersList,
      chatGroupMembersCount,
      freeUsersList,
      addChatMember,
      deleteChatMember,
      deleteMessages,
      getFreeChatUsersHandler,
      mainUserData: userData,
      deleteChat,
      exitFromChat,
      isShowConfirmModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__header {
    display: grid;
    height: 100%;
    background-color: var(--bgcColor);
    border-left: 1px solid black;

    grid-template-columns: 1fr 300px;
    justify-items: baseline;
    align-content: center;
    padding-left: 30px;

    &-data {
      height: 100%;
      grid-column: 1/2;
      position: relative;
    }
  }

  &__title {
    color: var(--textColor);

    &--private {
      grid-row: 1/3;
      width: 100%;
      align-self: center;
    }
  }

  &__title,
  &__count {
    text-align: center;
    display: flex;
    justify-content: center;
  }

  &__user-group {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

  &__count {
    font-size: 14px;
    color: var(--secondTextColor);
    cursor: pointer;
    user-select: none;
  }

  &__topbar {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    grid-column: 2/3;
    justify-self: center;

    button {
      height: 40px;
      margin-right: 10px;
    }
  }

  &__exit {
    margin-right: 15px;
    text-decoration: none;
    align-self: center;
    justify-self: end;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: var(--dangerColor);
    grid-column: 3/4;
  }
}

@media (max-width: 720px) {
  .chat {
    &__header {
      grid-template-columns: auto;

      &-data {
        width: auto;
      }
    }
  }
}
</style>
