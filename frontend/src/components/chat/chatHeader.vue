<template>
  <div class="chat__header">
    <div class="chat__header-data">
      <h1 class="chat__title" :class="{ 'chat__title--private': !groupUsers }">{{ chatData.title }}</h1>
      <p class="chat__count" v-if="groupUsers" @click="showUsers = !showUsers">
        {{ groupUsers.length }} peoples
      </p>
      <NavbarUserList :users='groupUsers' :show='showUsers' />

    </div>

    <div class="chat__topbar" v-if="showTollbar">
      <div class="chat__user-group">
        <button class="btn--chat" @click="showAddUsers = !showAddUsers">Add to group</button>
        <NavbarUserList :users='invaitedUsers' :show='showAddUsers' @selectUser="addUserToChat" />
      </div>
      <div class="chat__user-group">
        <button class="chat__add-group btn--chat" @click="showRemoveUsers = !showRemoveUsers">Remove from group</button>
        <NavbarUserList :users='removeUsersList' :show='showRemoveUsers'  @selectUser="removeUserFromChat" />
      </div>

    </div>
    <a class="chat__exit" href="#" @click="exitGroup" v-if="groupUsers && !showTollbar">Exit chat</a>
  </div>
</template>

<script>
import { computed, inject, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex'

import $api from '../../axios';
import NavbarUserList from './navbarUserList.vue';

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const userData = computed(() => store.getters["auth/getUserData"]);
    const chatData = computed(() => store.getters["chat/getChatData"]);
    const userId = userData.value.id;
    const chatId = computed(() => route.params.id);
    
    const showTollbar = computed(() => chatData.value.adminId === userId);

    const showUsers = ref(false);
    const showAddUsers = ref(false);
    const showRemoveUsers = ref(false);

    const groupUsers = computed(() => store.state.chat.chatData.group)
    const removeUsersList = computed(() => store.getters['chat/getRemoveUserList'])
    const invaitedUsers = computed(() => store.state.chat.invaitedUsers)

    const socket = inject('socket')

    async function addUserToChat(id) {
      store.dispatch('chat/invaiteUserToChat', {
        userId: id,
        chatId: chatId.value
      })
    }

    async function removeUserFromChat(id) {
       store.dispatch('chat/removeUserFromChat', {
        userId: id,
        chatId: chatId.value
       })
    }

    async function exitGroup() {
      console.log("exit user with id ", userId);
      const res = await $api.delete("/chat/exitUser", {
        params: {
          chatId: chatId.value,
          userId,
        }
      })
      store.state.chat.chats = store.state.chat.chats.filter(chat => chat.chatId !== chatId.value)
      store.commit('chat/cleanMessages')
      store.commit('chat/cleanChatData')
      socket.emit('userLeave', {
        roomId: chatId.value,
        userId
      })
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
      removeUsersList
    };
  },
  components: { NavbarUserList }
};
</script>

<style lang="scss" scoped>
.chat {

  &__header {
    display: grid;
    height: 100%;
    background-color: $bgcColor;
    border-left: 1px solid black;

    grid-template-columns: repeat(3, 1fr);
    align-content: center;

    &-data {
      height: 100%;
      grid-column: 1/2;
      position: relative;
    }
  }

  &__title {
    color: $textColor;

    &--private {
      grid-row: 1/3;
      align-self: center;
      width: 250px;
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
    color: $secondTextColor;
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
    color: $dangerColor;
    grid-column: 3/4;
  }
}
</style>