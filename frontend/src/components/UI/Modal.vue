<template>
  <Teleport to="#app" v-if="isShowCTX">
    <div
      ref="modalRoot"
      tabindex="0"
      @keydown="closeCTX"
      @contextmenu.prevent="closeCTX"
      @click="closeCTX"
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
import { onUpdated, ref } from "vue";
export default {
  emits: ["closeCTX"],
  props: ["isShowCTX"],
  setup(_, { emit }) {
    function closeCTX() {
      emit("closeCTX");
    }

    const modalRoot = ref(null);

    onUpdated(() => {
      if (modalRoot.value) {
        modalRoot.value.focus();
      }
    });



    return {
      modalRoot,
      closeCTX,
    };
  },
};
</script>

<style></style>
