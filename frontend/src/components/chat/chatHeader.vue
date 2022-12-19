<template>
  <div class="chat__header">
    <div class="chat__header-data">
      <h1 class="chat__title" :class="{ 'chat__title--private': !groupUsers }">
        {{ chatData.title }}
        <div v-if="selectedMessages.length">
          <p>{{ selectedMessages.length }}</p>
          <button @click="selectedMessages = []">Cancel</button>
        </div>
      </h1>
      <p class="chat__count" v-if="groupUsers" @click="showUsers = !showUsers">
        {{ groupUsers.length }} peoples
      </p>
      <NavbarUserList :users="groupUsers" :show="showUsers" />
    </div>

    <div class="chat__topbar" v-if="showTollbar">
      <div class="chat__user-group">
        <button class="btn" @click="showAddUsers = !showAddUsers">
          <i class="bi bi-person-plus-fill"></i>
        </button>
        <NavbarUserList
          :users="invaitedUsers"
          :show="showAddUsers"
          @selectUser="addUserToChat"
        />
      </div>
      <div class="chat__user-group">
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
</template>

<script>
import { computed, inject, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import $api from "../../axios";
import NavbarUserList from "./navbarUserList.vue";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const chatId = computed(() => route.params.id);
    const chatData = computed(() => store.state.chat.chats[chatId.value]);
    const userData = computed(() => store.state.auth.user);
    const userId = userData.value.id;

    const selectedMessages = inject("selectedMessages");

    const showTollbar = computed(() => chatData.value.adminId === userId);

    const showUsers = ref(false);
    const showAddUsers = ref(false);
    const showRemoveUsers = ref(false);

    // const groupUsers = computed(() => store.state.chat.chatData.group);
    const groupUsers = null;
    const removeUsersList = computed(
      () => store.getters["chat/getRemoveUserList"]
    );
    const invaitedUsers = computed(() => store.state.chat.invaitedUsers);

    const chatSocket = inject("chatSocket");

    async function addUserToChat(id) {
      store.dispatch("chat/invaiteUserToChat", {
        userId: id,
        chatId: chatId.value,
      });
    }

    async function removeUserFromChat(id) {
      store.dispatch("chat/removeUserFromChat", {
        userId: id,
        chatId: chatId.value,
      });
    }

    async function exitGroup() {
      console.log("exit user with id ", userId);
      const res = await $api.delete("/chat/exitUser", {
        chatId: chatId.value,
        userId,
      });
      store.state.chat.chats = store.state.chat.chats.filter(
        (chat) => chat.chatId !== chatId.value
      );
      store.commit("chat/cleanMessages");
      store.commit("chat/cleanChatData");
      chatSocket.emit("userLeave", {
        roomId: chatId.value,
        userId,
      });
      if (res.data) {
        router.push("/chat");
      }
    }
    return {
      chatData,
      showUsers,
      showAddUsers,
      showRemoveUsers,
      showTollbar,
      exitGroup,
      groupUsers,
      invaitedUsers,
      addUserToChat,
      removeUserFromChat,
      removeUsersList,
      selectedMessages,
    };
  },
  components: { NavbarUserList },
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
