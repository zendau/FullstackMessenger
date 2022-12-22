<template>
  <div class="chat__header">
    <div v-if="selectedMessages.length">
      <p>{{ selectedMessages.length }}</p>
      <button @click="deleteMessages">Deleted</button>
      <button @click="selectedMessages = []">Cancel</button>
    </div>
    <div class="chat__header-data">
      <div v-if="chatData.adminId">
        <h1 class="chat__title chat__title--private">
          Group - {{ chatData.title }}
        </h1>
        <p @click="isShowUsersList = !isShowUsersList">
          Members - {{ chatGroupMembersCount }}
        </p>
      </div>
      <div v-else>
        <h1 class="chat__title">Chat - {{ chatData.title }}</h1>
        <p>Status - {{ privateChatOnlineStatus }}</p>
      </div>
      <!-- <p class="chat__count" v-if="groupUsers" @click="showUsers = !showUsers">
        {{ groupUsers.length }} peoples
      </p> -->
      <!-- <NavbarUserList :users="groupUsers" :show="showUsers" /> -->
    </div>

    <div class="chat__topbar" v-if="showTollbar">
      <div class="chat__user-group">
        <button class="btn" @click="showAddUsers = !showAddUsers">
          <i class="bi bi-person-plus-fill"></i>
        </button>
        <!-- <NavbarUserList
          :users="invaitedUsers"
          :show="showAddUsers"
          @selectUser="addUserToChat" -->
        />
      </div>
      <div class="chat__user-group">
        <button
          class="chat__add-group btn"
          @click="showRemoveUsers = !showRemoveUsers"
        >
          <i class="bi bi-person-dash-fill"></i>
        </button>
        <!-- <NavbarUserList
          :users="removeUsersList"
          :show="showRemoveUsers"
          @selectUser="removeUserFromChat" -->
        />
      </div>
    </div>
    <a
      class="chat__exit"
      href="#"
      @click="exitGroup"
      v-if="groupUsers && !showTollbar"
      >Exit chat</a
    >
  </div>
  <div v-if="isShowUsersList" style="color: white">
    <ul style="margin: 0">
      <li
        style="margin: 0"
        v-for="userData in chatData.users"
        :key="userData.id"
      >
        <div>{{ userData.id }}</div>
        <div>{{ userData.login }}</div>
        <div>{{ userData.lastOnline }}</div>
        <button
          @click="deleteChatMember(userData.id)"
          v-if="chatData.adminId !== userData.id"
        >
          Delete
        </button>
        <div v-else>ADMIN</div>
      </li>
    </ul>
    <button @click="getFreeChatUsersHandler">Load free contacts</button>

    <ul>
      <li v-for="userData in freeUsersList" :key="userData.id">
        <div>{{ userData.id }}</div>
        <div>{{ userData.login }}</div>
        <div>{{ userData.lastOnline }}</div>
        <button @click="addChatMember(userData.id)">Add</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import $api from "../../axios";
import NavbarUserList from "./navbarUserList.vue";

export default {
  emits: ["deleteMessages"],
  components: { NavbarUserList },
  setup(_, { emit }) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const chatId = computed(() => route.params.id);
    const chatData = computed(() => store.state.chat.chats[chatId.value]);
    const userData = computed(() => store.state.auth.user);

    const selectedMessages = inject("selectedMessages");

    const showTollbar = computed(
      () => chatData.value.adminId === userData.value.id
    );

    const showUsers = ref(false);
    const showAddUsers = ref(false);
    const showRemoveUsers = ref(false);

    // const groupUsers = computed(() => store.state.chat.chatData.group);
    const groupUsers = null;
    const removeUsersList = computed(
      () => store.getters["chat/getRemoveUserList"]
    );
    const invaitedUsers = computed(() => store.state.chat.invaitedUsers);
    const freeUsersList = ref([]);

    const chatSocket = inject("chatSocket");

    const privateChatOnlineStatus = computed(() => {
      const userId = Object.keys(chatData.value.users)[0];
      return chatData.value.users[userId].lastOnline;
    });

    const chatGroupMembersCount = computed(
      () => Object.keys(chatData.value.users).length
    );

    const isShowUsersList = ref(false);

    chatSocket.on("getFreeChatContacts", (freeContacts) => {
      console.log("freeContacts", freeContacts);
      freeUsersList.value = freeContacts;
    });

    // async function addUserToChat(id) {
    //   store.dispatch("chat/invaiteUserToChat", {
    //     userId: id,
    //     chatId: chatId.value,
    //   });
    // }

    // async function removeUserFromChat(id) {
    //   store.dispatch("chat/removeUserFromChat", {
    //     userId: id,
    //     chatId: chatId.value,
    //   });
    // }

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
      chatSocket.emit("getFreeChatUsers", {
        userId: userData.value.id,
        chatId: chatId.value,
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
      });
    }

    function addChatMember(memberId) {
      chatSocket.emit("invite-user", {
        chatId: chatId.value,
        userId: memberId,
      });
    }

    chatSocket.on("inviteChatUser", (inseredUserData) => {
      console.log("inseredUserData", inseredUserData);

      if (!inseredUserData) {
        console.log("ERROR");
        return;
      }

      if (!inseredUserData) return;

      const invitedUserId = inseredUserData.userData.id;

      freeUsersList.value = freeUsersList.value.filter(
        (user) => user.id !== invitedUserId
      );
      console.log("freeUsersList after insert", freeUsersList.value);

      // if (freeUsersList.value.hasOwnProperty(inseredUserData[0].userId)) {
      //   delete freeUsersList.value[inseredUserData[0].userId];
      // }

      // if (!roomsData.value.hasOwnProperty(inseredUserData.inseredData.chatId))
      //   return;
      store.commit("chat/addUserToGroup", {
        chatId: inseredUserData.inseredData.chatId,
        userData: inseredUserData.userData,
      });
    });

    chatSocket.on("removeChatUser", (removeUser) => {
      debugger;
      if (!removeUser.userData) {
        console.log("ERROR");
        return;
      }

      console.log("remove user", removeUser);

      let roomData = null;

      if (store.state.chat.chats.hasOwnProperty(removeUser.userData.chatId)) {
        roomData = store.state.chat.chats[removeUser.userData.chatId];
      } else if (
        (store.state.chat.currentTempChatData.id = removeUser.userData.chatId)
      ) {
        roomData = store.state.chat.currentTempChatData;
      } else {
        console.log("ERROR");
        return;
      }

      freeUsersList.value.push(removeUser.deletedUserInfo);

      roomData.users = roomData.users.filter(
        (user) => user.id !== removeUser.deletedUserInfo.id
      );

      // delete roomsData.value[removeUserData.chatId].users[removeUserData.userId];
      if (removeUser.deletedUserInfo.id !== userData.value.id) return;

      store.commit("chat/deleteChatData", removeUser.userData.chatId);
      router.push("/");
    });

    return {
      chatData,
      showUsers,
      showAddUsers,
      showRemoveUsers,
      showTollbar,
      groupUsers,
      invaitedUsers,
      removeUsersList,
      selectedMessages,
      privateChatOnlineStatus,
      isShowUsersList,
      chatGroupMembersCount,
      freeUsersList,
      // exitGroup,
      addChatMember,
      deleteChatMember,
      deleteMessages,
      getFreeChatUsersHandler,
      // addUserToChat,
      // removeUserFromChat,
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
