<template>
  <ModalWindow
    :is-show-c-t-x="isOpenDeviceModal"
    @close-context="closeCTX"
  >
    <div class="modal">
      <a
        class="close-btn"
        @click="closeCTX"
      />
      <div class="device__container">
        <div class="device__content">
          <div>
            <p>{{ $t("setting.deviceModal.os") }}</p>
            <p>{{ deviceData.osName }} - {{ deviceData.osVersion }}</p>
          </div>
          <div>
            <p>{{ $t("setting.deviceModal.device") }}</p>
            <p>{{ deviceData.brand }} - {{ deviceData.model }}</p>
          </div>
          <div>
            <p>{{ $t("setting.deviceModal.time") }}</p>
            <p>{{ $d(deviceData.lastOnline, "long") }}</p>
          </div>
          <div>
            <p>IP:</p>
            <p>{{ deviceData.ipAdress }}</p>
          </div>
          <font-awesome-icon :icon="icon" />
        </div>
        <div class="modal__container-btn">
          <button
            v-if="!isCurrent"
            class="modal__btn"
            @click="deleteDevices"
          >
            {{ $t("setting.deviceModal.delete") }}
          </button>
          <button
            class="modal__btn"
            @click="closeCTX"
          >
            {{ $t("setting.deviceModal.cancel") }}
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
    isCurrent: {
      type: Boolean,
      required: true,
    },
    deviceData: {
      type: Object,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    isOpenDeviceModal: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close-context", "delete-devices"],
  setup(props, { emit }) {
    function closeCTX() {
      emit("close-context");
    }

    function deleteDevices() {
      closeCTX();
      emit("delete-devices", [props.deviceData.id]);
    }

    return {
      deleteDevices,
      closeCTX,
    };
  },
};
</script>

<style lang="scss" scoped>
.device {
  &__container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__content {
    margin: 0 auto;
    display: grid;
    grid-template-columns: 30px 1fr;
    align-content: center;
    justify-items: center;
    align-items: center;
    height: 100%;
    column-gap: 30px;

    div {
      display: grid;
      grid-template-columns: 100px 1fr;
      width: 100%;

      p:nth-child(2) {
        text-align: center;
      }
    }

    svg {
      grid-column: 1/2;
      grid-row: 1/5;
      width: 30px;
      height: 30px;
    }
  }
}
</style>
