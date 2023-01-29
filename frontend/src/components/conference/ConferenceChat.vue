<template>
  <ChatContainer />
</template>

<script>
import { computed, onMounted, ref, provide } from "vue";
import { useStore } from "vuex";

import ChatContainer from "@/components/chat/ChatContainer.vue";

export default {
  components: { ChatContainer },
  setup() {
    const store = useStore();

    provide("isConferenceChat", true);

    const chatId = ref("a5600fc3-4905-4b5c-a9e6-e09531cd5158");
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
