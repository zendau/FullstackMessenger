<template>
  <ModalWindow
    :is-show-c-t-x="isOpenDeviceModal"
    @close-context="closeCTX"
  >
    <div class="test">
      <a
        class="close-btn"
        @click="closeCTX"
      />
      <p>OS: {{ deviceData.osName }} - {{ deviceData.osVersion }}</p>
      <p>Device: {{ deviceData.brand }} - {{ deviceData.model }}</p>
      <p>Time: {{ deviceData.lastOnline }}</p>
      <p>IP: {{ deviceData.ipAdress }}</p>
      <font-awesome-icon :icon="icon" />
      <button
        v-if="!isCurrent"
        @click="deleteDevices"
      >
        Delete session
      </button>
      <button @click="closeCTX">
        Cancel
      </button>
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
