<template>
  <ModalWindow
    :is-show-c-t-x="isOpenModal"
    @close-context="closeCTX"
  >
    <div class="test">
      <h2>{{ title }}</h2>
      <button @click="actionHandler">
        Confirm
      </button>
      <button @click="closeCTX">
        Cancel
      </button>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from "../UI/ModalWindow.vue";

export default {
  components: { ModalWindow },
  props: {
    actionHandler: {
      type: Function,
      required: true,
    },
    isOpenModal: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  emits: ["close-confirm-modal"],
  setup(props, { emit }) {
    function closeCTX() {
      emit("close-confirm-modal");
    }

    return {
      closeCTX,
    };
  },
};
</script>

<style lang="scss">
.test {
  width: 400px;
  height: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: var(--bgcColor);
  color: var(--textColor);
}

.close-btn {
  position: absolute;
  right: 32px;
  top: 32px;
  width: 32px;
  height: 32px;
  opacity: 0.3;

  &:hover {
    opacity: 1;
  }

  &:before,
  &:after {
    position: absolute;
    left: 15px;
    content: " ";
    height: 33px;
    width: 2px;
    background-color: #333;
  }

  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
}
</style>
