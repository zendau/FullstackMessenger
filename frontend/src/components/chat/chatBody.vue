<template>
  <div class="chat__body" v-if="roomData">
    <message />
  </div>
</template>

<script>
import Message from "./message.vue";

import { inject } from "vue";
export default {
  components: { Message },
  setup() {
    const roomData = inject("roomData");

    return {
      roomData,
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