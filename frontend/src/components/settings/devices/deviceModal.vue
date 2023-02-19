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
      <p>{{ $t("setting.deviceModal.os") }} {{ deviceData.osName }} - {{ deviceData.osVersion }}</p>
      <p>{{ $t("setting.deviceModal.device") }}: {{ deviceData.brand }} - {{ deviceData.model }}</p>
      <p>{{ $t("setting.deviceModal.time") }}: {{ deviceData.lastOnline }}</p>
      <p>IP: {{ deviceData.ipAdress }}</p>
      <font-awesome-icon :icon="icon" />
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
