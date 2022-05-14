<template>
  <file-upload>
    <div class="chat__body">
      <message
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :author="userData.login"
      />
      <div ref="scrollEnd"></div>
    </div>
  </file-upload>
</template>

<script>
import Message from "./message.vue";

//import $api from '../../axios'

import { useRoute } from "vue-router";
import { inject, ref, computed, onMounted, onUpdated, watch } from "vue";
import { useStore } from "vuex";
import FileUpload from "../fileUpload.vue";
export default {
  components: { Message, FileUpload },
  setup() {
    const store = useStore();

    const socket = inject("socket");
    const messages = computed(() => store.state.chat.messages);
    const scrollEnd = ref(null);

    const userData = computed(() => store.getters['auth/getUserData'])

    const route = useRoute();

    socket.on("newMessage", (messageData) => {
      console.log("NEEEEW", messageData)
      store.commit('chat/addMessage', messageData)
    });

    const message = computed(() => store.getters['chat/getMessageData']);
    //const isLoadedMessages = ref(false);

    const chatId = computed(() => route.params.id);

    const observer = new IntersectionObserver(async (entries) => {
      console.log(entries, entries[0].isIntersecting, message.value.hasMore);
      if (
        entries[0].isIntersecting &&
        message.value.hasMore &&
        messages.value.length !== 0
      ) {
        console.log("observer");
        store.dispatch("chat/getMessges", chatId.value);
        //  message.value.page++;
        // isLoadedMessages.value = true;
        // const messagesRes = await $api.get(
        //   `/message/getAllChat/${chatId.value}`,
        //   {
        //     params: {
        //       page:  message.value.page,
        //       limit:  message.value.limit,
        //     },
        //   }
        // );
        // if (messagesRes.data.length === 0) {
        //    message.value.hasMore = false;
        // }
        // messages.value.push(...messagesRes.data);
        // console.log("messagesRes", messagesRes);
        // isLoadedMessages.value = false;
      }
    });
    console.log("setup");
    //store.dispatch('chat/getMessges', chatId.value)

    onUpdated(() => {
      console.log("updated");
      
    });

    watch( messages, () => {
      console.log("UPDATE")
      if (messages.value.length === 0) {
        store.dispatch("chat/getMessges", chatId.value);
        // observer.observe(scrollEnd.value);
      }
    })

    onMounted(() => {
      console.log("MOUNTED");

      store.dispatch("chat/getMessges", chatId.value);
      observer.observe(scrollEnd.value);
    });

    return {
      scrollEnd,
      messages,
      userData
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__body {
    display: flex;
    flex-direction: column-reverse;
    overflow: auto;
    background-color: $menuColor;
    padding: 1px 0;
    
    height: 100%;

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
@media (max-width: 960px) {
  .chat {
    &__body {
      padding: 10px;
      align-items: center;
    }
  }
}
</style>