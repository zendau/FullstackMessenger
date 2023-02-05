<template>
  <ChatContainer />
</template>

<script>
import { computed, onMounted, provide } from "vue";
import { useStore } from "vuex";

import ChatContainer from "@/components/chat/ChatContainer.vue";
import { useRoute } from "vue-router";

export default {
  components: { ChatContainer },
  setup() {
    const store = useStore();

    const router = useRoute();

    provide("isConferenceChat", true);

    const chatId = computed(() => router.params.id);
    provide("chatId", chatId);
    const userData = computed(() => store.state.auth.user);

    onMounted(() => {
      store.dispatch("chat/getChatMessages", {
        chatId: chatId.value,
        userId: userData.value.id,
      });
    });

    return {
      chatId,
    };
  },
};
</script>

<style></style>
