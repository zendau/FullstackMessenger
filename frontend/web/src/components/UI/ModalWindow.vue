<template>
  <Teleport
    v-if="isShowCTX"
    to="#app"
  >
    <div
      ref="modalRoot"
      tabindex="0"
      class="modal-container"
      @keydown="closeCTX"
      @contextmenu.prevent="closeCTX"
      @click="closeCTX"
    />
    <slot />
  </Teleport>
</template>

<script>
import { onUpdated, ref } from "vue";
export default {
  props: {
    isShowCTX: {
      type: [Boolean, Object],
      required: false,
      default: null,
    },
  },
  emits: ["close-context"],
  setup(_, { emit }) {
    function closeCTX() {
      emit("close-context");
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

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  height: 100vh;
  width: 100%;
}
</style>
