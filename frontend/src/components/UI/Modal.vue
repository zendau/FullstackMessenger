<template>
  <Teleport to="#app" v-if="isShowCTX">
    <div
      @contextmenu.prevent="closeMessageCTX"
      @click="closeMessageCTX"
      style="
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        height: 100vh;
        width: 100%;
      "
    ></div>
    <slot />
  </Teleport>
</template>

<script>
export default {
  emits: ['closeMessageCTX'],
  props: ["isShowCTX"],
  setup(_, { emit }) {
    function closeMessageCTX() {
      emit("closeMessageCTX");
    }

    return {
      closeMessageCTX,
    };
  },
};
</script>

<style></style>
