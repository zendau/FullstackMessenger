<template>
  <div
    class="chats__container"
    :class="{ 'chats__container--active': !isShowMobileMessages }"
  >
    <input type="text" @input="searchChats" />
    <p class="empty_message" style="color: red;" v-if="Object.keys(chatsList).length === 0">No chats</p>
    <ul class="chats__list">
      <li
        class="chats__item"
        v-for="chat in chatsList"
        :key="chat.id"
        @click="openChat(chat.id)"
      >
        <!-- <router-link
          :to="`/chat/${chat.id}`"
          @click="isShowMobileMessages = true"
        > -->

        <i class="bi bi-people" v-if="chat.adminId" />
        <i class="bi bi-person" v-else />
        <div class="chats__info">
          <p>{{ chat.title }}</p>
          <p>{{ chat.lastMessage?.authorLogin }}</p>
          <p>{{ chat.lastMessage?.text }}</p>
        </div>
        <!-- </router-link> -->
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import debounce from "../../utils/debounce";
// import { io } from "socket.io-client";

export default {
  setup(_, { emit }) {
    const store = useStore();
    // store.dispatch('chat/getChats')

    // const socket = io("http://localhost:80", { path: "/socketChat" });
    // socket.on("connect", () => {
    //   socket.emit("connect-user", {
    //     userId: userId.value,
    //     userData: {
    //       login: "four",
    //     },
    //     limit: loadChatsPagination.limit,
    //     chatId: route.params.id,
    //   });
    // });

    const isShowMobileMessages = inject("isShowMobileMessages");
    const chatSocket = inject("chatSocket");

    const chatsData = computed(() => store.state.chat.chats);
    const userId = computed(() => store.state.auth.user.id);
    function openChat(chatId) {
      emit("openChat", chatId);
    }

    const searchData = ref(null);
    const chatsList = computed(() => searchData.value ?? chatsData.value);

    const searchChats = debounce((el) => {
      // socket.emit("serchChats", {
      //   userId: "",
      //   pattern: chatId.value,
      // });
      // console.log("press_end");

      const pattern = el.target.value;
      //console.log('pattern', pattern.length, pattern)
      if (pattern.length === 0) {
        searchData.value = null;
        return;
      }

      console.log({
        userId: userId.value,
        pattern,
      });

      chatSocket.emit("serchChats", {
        userId: userId.value,
        pattern,
      });
    });

    chatSocket.on("getChatsByPattern", (chatsData) => {
      console.log("chatsData", chatsData);
      searchData.value = chatsData;
    });

    return {
      isShowMobileMessages,
      chatsData,
      searchChats,
      chatsList,
      openChat,
    };
  },
};
</script>

<style lang="scss" scoped>
.chats {
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

  &__container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
    box-sizing: border-box;
    background-color: var(--bgcColor);

    button {
      margin-bottom: 10px;
      width: 100px;
      align-self: center;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    transition: 0.3s ease;
    cursor: pointer;
    color: var(--textColor);
    a {
      color: inherit;
      text-decoration: none;
      width: 100%;
      height: 100%;
      padding: 14.5px 0;
      display: flex;
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

  &__info {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
}

.router-link-active {
  background-color: #2b5278;
}
</style>
