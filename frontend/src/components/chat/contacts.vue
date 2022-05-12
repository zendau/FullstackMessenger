<template>
  <div class="chat__contacts">
    <button class="btn--chat" @click="groupType = !groupType">
      {{ groupType ? "Close" : "Create group" }}
    </button>
    <create-group v-if="groupType" />
    <ul class="contacts__list">
      <li
        class="contact__item"
        v-for="user in contacts"
        :key="user.id"
        @click="openUserChat(user.id)"
      >
        <i class="bi bi-person"></i>
        <input v-if="groupType" type="checkbox" />
        <p>{{ user.login }}</p>
      </li>
    </ul>
  </div>
</template>


<script>
//import { ref } from "vue";
import $api from "../../axios";

import { useRouter } from "vue-router";

import { computed, onMounted, reactive, ref } from "vue";
import createGroup from "./createGroup.vue";

import { useStore } from "vuex";

export default {
  components: { createGroup },
  setup() {
    const router = useRouter();
    const store = useStore();

    const userData = computed(() => store.getters["auth/getUserData"]);
    const contacts = reactive([]);

    const login = userData.value.login;

    onMounted(async () => {
      const res = await $api.get("/chat/getContacts");
      contacts.push(...res.data.filter((user) => user.login !== login));
      console.log("CONTACTS", contacts, login);
    });


    const groupType = ref(false);
    const clients = ref([]);

    const userId = userData.value.id;

    const roomName = ref("");

    async function openUserChat(id) {
      console.log("test", id, userId);
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
          groupType: false,
        });

        const chatId = chatData.data.chatId;

        router.push(`/chat/${chatId}`);
      }
    }

    const clientLength = computed(() => {
      if (clients.value.length < 2) {
        if (roomName.value.length < 1) {
          return true;
        }
        return true;
      }

      return false;
    });

    async function createGroupChat() {
      console.log("groupCreate");
      const chatData = await $api.post("/chat/create", {
        adminId: parseInt(userId),
        groupName: roomName.value,
        users: [...clients.value],
        groupType: true,
      });

      if (chatData.data) {
        router.push(`/chat/${chatData.data.chatId}`);
      }
    }

    return {
      login,
      contacts,
      openUserChat,
      groupType,
      clients,
      clientLength,
      createGroupChat,
      userId,
      roomName,
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