<template>
  <div class="box">
    <h3>Hello {{ login }}</h3>
    clients - {{ clients }} clientLength - {{ clientLength }}
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckDefault"
        v-model="groupType"
      />
      <label class="form-check-label" for="flexSwitchCheckDefault"
        >Group type</label
      >
    </div>
    <div v-if="groupType">
      <input
        type="text"
        class="form-control"
        placeholder="Group name"
        v-model="roomName"
      />
      <button
        class="btn btn-primary"
        :disabled="clientLength"
        @click="createGroupChat"
      >
        Create group
      </button>
    </div>

    <ul>
      <li v-for="user in contacts" :key="user.id">
        <p>{{ user.id }}</p>
        <p>{{ user.login }}</p>
        <div class="form-check" v-if="groupType">
          <input
            class="form-check-input"
            type="checkbox"
            :value="user.id"
            id="flexCheckDefault"
            v-model="clients"
          />
          <label class="form-check-label" for="flexCheckDefault">
            Add to group
          </label>
        </div>
        <button v-else @click="openUserChat(user.id)" class="btn btn-primary">
          Enter to chat
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
//import { ref } from "vue";
import $api from "../axios";

import { useRouter } from "vue-router";

import { computed, reactive, ref } from "vue";

export default {
  async setup() {
    const router = useRouter();

    const res = await $api.get("/chat/getContacts");

    const login = localStorage.getItem("login");

    const contacts = reactive([]);
    contacts.push(...res.data.filter((user) => user.login !== login));

    const groupType = ref(false);
    const clients = ref([]);

    const userId = localStorage.getItem("id");

    const roomName = ref("");

    async function openUserChat(id) {
      console.log("test", id, userId);

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

<style scoped>
.box {
  min-height: 10px;
  min-width: 10px;
  border: 1px solid red;
  padding: 10px;
  position: absolute;
  right: 300px;
}
</style>