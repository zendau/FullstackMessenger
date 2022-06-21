<template>
  <div class="chat__contacts" :class="{'chat__contacts--active': !isShowMobileMessages}">
    <button class="btn" @click="groupType = !groupType">
      {{ groupType ? "Close" : "Create group" }}
    </button>
    <create-group v-if="groupType" :groupUsers="groupUsers" :adminId="userId" />
    <ul class="contacts__list">
      <li class="contact__item" v-for="user in contacts" :key="user.id" @click="openUserChat(user.id)">
        <i class="bi bi-person"></i>
        <input v-if="groupType" v-model="groupUsers" :value="user.id" type="checkbox">
        <p>{{ user.login }}</p>
      </li>
    </ul>
  </div>
</template>


<script>
//import { ref } from "vue";
import $api from "../../axios";

import { useRouter } from "vue-router";

import { computed, inject, ref } from "vue";
import createGroup from "./createGroup.vue";

import { useStore } from "vuex";

export default {
  components: { createGroup },
  setup() {
    const router = useRouter();
    const store = useStore();

    const isShowMobileMessages = inject('isShowMobileMessages')

    const userData = computed(() => store.state.auth.user)
    const contacts = computed(() => store.state.chat.constacts)

    const groupUsers = ref([]);

    const login = userData.value.login;

    store.dispatch('chat/getContacts')

    const groupType = ref(false);
    const userId = userData.value.id;

    const roomName = ref("");

    async function openUserChat(id) {
      if (groupType.value) return;

      const res = await $api.post("/chat/check", {
        adminId: userId,
        users: [id],
      });

      if (res.data.status) {
        router.push(`/chat/${res.data.chatId}`);
      } else {
        console.log("create");
        const chatData = await $api.post("/chat/create", {
          adminId: userId,
          users: [id],
        });

        const chatId = chatData.data.chatId;

        router.push(`/chat/${chatId}`);
      }
    }

    async function createGroupChat() {
      console.log("groupCreate");
      const chatData = await $api.post("/chat/create", {
        adminId: parseInt(userId),
        groupName: roomName.value,
        users: [...groupUsers.value],
      });

      if (chatData.data) {
        router.push(`/chat/${chatData.data.chatId}`);
      }
    }

    return {
      login,
      contacts,
      groupType,
      groupUsers,
      userId,
      roomName,
      isShowMobileMessages,
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
    background-color: $bgcColor;

    button {
      margin-bottom: 10px;
      width: 100px;
      align-self: center;
    }
  }
}

.contacts {
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
    color: $textColor;
    padding: 14px 0;

    a {
      padding: 14.5px 0;
    }

    &:hover {
      background-color: $itemColor;
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