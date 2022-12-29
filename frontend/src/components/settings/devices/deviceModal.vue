<template>
  <Modal :isShowCTX="isOpenDeviceModal" @closeCTX="closeCTX">
    <div class="test">
      <a class="close-btn" @click="closeCTX"></a>
      <p>OS: {{ deviceData.osName }} - {{ deviceData.osVersion }}</p>
      <p>Device: {{ deviceData.brand }} - {{ deviceData.model }}</p>
      <p>Time: {{ deviceData.lastOnline }}</p>
      <p>IP: {{ deviceData.ipAdress }}</p>
      <font-awesome-icon :icon="icon" />
      <button v-if="!isCurrent" @click="deleteDevices">Delete session</button>
      <button @click="closeCTX">Cancel</button>
    </div>
  </Modal>
</template>

<script>
import Modal from "../../UI/Modal.vue";
import {} from "vue";

export default {
  props: ["deviceData", "isOpenDeviceModal", "icon", "isCurrent"],
  emits: ["closeCTX", "deleteDevices"],
  components: { Modal },
  setup(props, { emit }) {
    function closeCTX() {
      emit("closeCTX");
    }

    function deleteDevices() {
      closeCTX()
      emit("deleteDevices", [props.deviceData.id]);
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
