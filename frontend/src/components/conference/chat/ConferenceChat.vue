<template>
  <div class="chat__header">
    Chat
  </div>
  <file-upload>
    <ul class="chat__body">
      <message
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
      <div ref="scrollEnd" />
    </ul>
  </file-upload>
  <chat-footer :room-id="roomId" />
</template>

<script>
import Message from "./ChatMessage.vue";

import { ref, computed, onMounted, provide, onUnmounted } from "vue";
import { useStore } from "vuex";
import FileUpload from "@/components/FileUpload.vue";
import ChatFooter from "./ConverenceChatFooter.vue";
import { io } from "socket.io-client";
export default {
  components: { Message, FileUpload, ChatFooter },
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const scrollEnd = ref(null);

    const messages = computed(() => store.state.chat.messages);
    const userData = computed(() => store.state.auth.user);

    const files = ref([]);
    provide("files", files);

    let userId = null;

    const socket = io(import.meta.env.VITE_SOCKET_HOST, { path: "/socketChat" });
    provide("socket", socket);

    const socketConnected = ref(false);
    provide("connected", socketConnected);
    socket.on("connect", () => {
      console.log("connected gateway");
      socketConnected.value = true;
      userId = socket.id;
      socket.emit("connect-user", {
        userLogin: userData.value.login,
        userId,
      });
      socket.emit("join-room", {
        userId,
        roomId: props.roomId,
      });
    });

    console.log("join to the room");

    onUnmounted(() => {
      socket.emit("exit-room", {
        userId,
        roomId: props.roomId,
      });
      socket.close();
    });

    socket.on("newMessage", (messageData) => {
      console.log("NEEEEW", messageData);
      store.commit("chat/addMessage", messageData);
    });

    socket.on("updateUserCount", (userId) => {
      console.log("user exit from chat", userId);
      store.commit("chat/removeUserFromGroup", userId);
    });

    const message = computed(() => store.state.chat.message);

    const observer = new IntersectionObserver(async (entries) => {
      console.log(entries, entries[0].isIntersecting, message.value.hasMore, messages.value.length);
      if (entries[0].isIntersecting && message.value.hasMore && messages.value.length !== 0) {
        console.log("observer");
        store.dispatch("chat/getMessges", props.roomId);
      }
    });

    onMounted(() => {
      store.dispatch("chat/getMessges", props.roomId);
      observer.observe(scrollEnd.value);
    });

    return {
      scrollEnd,
      messages,
      userData,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__header {
    text-align: center;
    font-size: 20px;
    color: var(--textColor);
    margin: 8px 0;
  }

  &__body {
    flex: 1;
    overflow: auto;
    height: 100%;
    padding: 1px;
    list-style: none;
    display: flex;
    flex-direction: column-reverse;
  }

  &__message {
    display: grid;
    grid-template-columns: 80% 20%;
    margin: 0 7px 7px;
    background-color: var(--bgcColor);
    padding: 6px;
    border-radius: 5px;

    h4 {
      max-width: 100px;
      grid-column: 1/2;
      color: var(--activeColor);
    }

    p {
      text-align: justify;
      grid-row: 2/3;
      grid-column: 1/3;
      color: var(--textColor);
    }

    span {
      align-self: flex-end;
      max-width: 50px;
      grid-column: 2/3;
      justify-self: end;
      color: var(--secondTextColor);
    }
  }
}
</style>
