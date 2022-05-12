<template>
  <chatNavbar />
  <section class="chat__container">
    <chats v-if="showContacts" />
    <contacts v-else />
    <messages />
  </section>
  <!-- <div v-if="chatId">
        chat id - {{chatId}}
    </div>
    <div v-else>
        no selected chat
    </div> -->
</template>

<script>
import { computed, provide, reactive } from "vue";

import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useStore } from "vuex";

import chatNavbar from "../../components/chat/navbar.vue";
import Contacts from "../../components/chat/contacts.vue";
import Messages from "../../components/chat/messages.vue";
import Chats from "../../components/chat/chats.vue";

import { io } from "socket.io-client";
import $api from "../../axios";

export default {
  components: { chatNavbar, Contacts, Messages, Chats },
  props: ['id', 'title'],
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const chatId = computed(() => route.params.id);

    const showContacts = ref(true);

    const roomData = reactive({
      title: null,
      group: null,
    });

    provide("roomData", roomData);
    provide("showContacts", showContacts);

    const store = useStore();
    const userData = computed(() => store.getters["auth/getUserData"]);

    const socket = io("http://localhost:80");
    provide("socket", socket);

    const socketConnected = ref(false);
    provide("connected", socketConnected);
    socket.on("connect", () => {
      console.log("connected gateway");
      socketConnected.value = true;
      socket.emit("connect-user", {
        userLogin: userData.value.email,
        userId: socket.id,
      });
    });

    const messages = reactive([]);
    const scrollEnd = ref(null);
    const isGroup = ref(null);
    // eslint-disable-next-line no-unused-vars
    const scrollArea = ref(null);
    const page = ref(0);
    const limit = ref(10);
    const hasMore = ref(true);
    const isLoadedMessages = ref(false);

    provide("scrollEnd", scrollEnd);
    provide("messages", messages)

    async function checkRoom(roomId) {
      const res = await $api.get(`/chat/checkId/${roomId}`);
      chatId.value = res.data.id;
      if (res.data.status === false) {
        router.push("/chat/");
      }
      if (res.data.groupName === null) {
        isGroup.value = false;
      } else {
        isGroup.value = true;
      }
      roomData.title =  props.title
      const messagesRes = await $api.get(
        `/message/getAllChat/${chatId.value}`,
        {
          params: {
            page: page.value,
            limit: limit.value,
          },
        }
      );

      console.log("messagesRes", messagesRes);
      if (messagesRes.data.status !== false) {
        messages.push(...messagesRes.data);
        console.log("!!!!", messages);
        //scrollArea.value.scrollTo(0, scrollArea.value.scrollHeight)
        observer.observe(scrollEnd.value);
      }

      console.log("test", scrollEnd, scrollEnd.value);
      console.log("test");

      console.log('join to the room')
        socket.emit('join-room', { 
            userId: socket.id,
            roomId,
      })
    }

    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && hasMore.value) {
        page.value++;
        isLoadedMessages.value = true;
        const messagesRes = await $api.get(
          `/message/getAllChat/${chatId.value}`,
          {
            params: {
              page: page.value,
              limit: limit.value,
            },
          }
        );
        if (messagesRes.data.length === 0) {
          hasMore.value = false;
        }
        messages.push(...messagesRes.data);
        console.log("messagesRes", messagesRes);
        isLoadedMessages.value = false;
      }
    });
    watch(
      () => route.params.id,
      (value) => checkRoom(value)
    );

    return {
      chatId,
      showContacts,
      Chats,
    };
  },
};
</script>

<style lang="scss">
#app {
  display: grid;
  grid-template-columns: 80px 1fr;
  height: 100vh;
  max-height: 100vh;
}

.chat__container {
  display: grid;
  grid-template-columns: 250px 1fr;
}

.btn {
  &--chat {
    background-color: $btnChat;
    border: none;
    color: $textColor;
    border-radius: 2px;
    padding: 5px 9px;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
      background-color: $btnHover;
    }
  }
}

@media (max-width: 720px) {
  .chat {
    &__container {
      grid-template-columns: 1fr;
    }

    &__contacts {
      display: none;

      &--active {
        display: block;
      }
    }
  }
}
</style>