<template>
  <ModalWindow
    :is-show-c-t-x="isOpenModal"
    @close-context="closeCTX"
  >
    <div class="modal">
      <div class="container">
        <h2>{{ title }}</h2>
        <div class="modal__container-btn">
          <button
            class="modal__btn"
            @click="actionHandler"
          >
            {{ $t("chat.confirmModal.confirm") }}
          </button>
          <button
            class="modal__btn"
            @click="closeCTX"
          >
            {{ $t("chat.confirmModal.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from "@/components/UI/ModalWindow.vue";

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

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-items: center;

  h2 {
    margin-bottom: 30px;
  }
}
</style>
