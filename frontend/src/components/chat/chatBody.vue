<template>
  <div class="chat__body" ref="scrollArea">
    <message v-for="message in messages" :key="message.id" :message="message" />
    <div ref="scrollEnd"></div>
  </div>
</template>

<script>
import Message from "./message.vue";
 
import $api from '../../axios'

import { useRoute } from "vue-router";
import { inject, ref, computed, onMounted, watch } from "vue";
export default {
  components: { Message },
  setup() {
    const socket = inject("socket");
    const messages = inject("messages");
    const scrollEnd = ref(null);

    const route = useRoute();

    socket.on("newMessage", (messageData) => {
      console.log("NEEEEW", messageData);
      messages.push(messageData);
    });

    // eslint-disable-next-line no-unused-vars
    const scrollArea = ref(null);
    const page = ref(0);
    const limit = ref(10);
    const hasMore = ref(true);
    const isLoadedMessages = ref(false);

    const chatId = computed(() => route.params.id);

    const observer = new IntersectionObserver(async (entries) => {
      console.log(entries, hasMore.value)
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

    onMounted(() => {
      console.log("MOUNTED")
      console.log(scrollEnd.value)
      observer.observe(scrollEnd.value);
    })
    
    watch((messages), () => {
      console.log(scrollArea.value)
      scrollEnd.value.scrollIntoView(false) 
    })
    

    return {
      scrollEnd,
      messages,
      scrollArea
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__body {
    display: flex;
    flex-direction: column;
    overflow: auto;
    background-color: $menuColor;

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