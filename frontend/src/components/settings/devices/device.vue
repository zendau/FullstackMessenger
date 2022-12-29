<template>
  <div v-if="deviceData">
    <p>{{ deviceData.osName }}</p>
    <p>{{ deviceData.brand }} - {{ deviceData.model }}</p>
    <p>{{ deviceData.lastOnline }}</p>
    <font-awesome-icon
      :icon="getDeviceIcon(deviceData.brand, deviceData.osName)"
    />
    <button @click="showDeviceModal(true)">Open</button>
    <device-modal
      :isCurrent="isCurrent"
      :isShowCTX="isOpenDeviceModal"
      :deviceData="deviceData"
      :icon="getDeviceIcon(deviceData.brand, deviceData.osName)"
      @deleteDevices="deleteDevices"
      @closeCTX="showDeviceModal(false)"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import deviceModal from "./deviceModal.vue";

export default {
  props: ["deviceData", "isCurrent"],
  emit: ["deleteDevices"],
  components: { deviceModal },
  setup(_, { emit }) {
    const isOpenDeviceModal = ref(false);

    function showDeviceModal(status) {
      isOpenDeviceModal.value = status;
    }

    function deleteDevices(deviceId) {
      emit("deleteDevices", deviceId);
    }

    const getDeviceIcon = (deviceName, osName) => {
      if (osName === "Android") {
        return "fa-brands fa-android";
      }

      if (osName === "iOS") {
        return "fa-brands fa-apple";
      }

      switch (deviceName) {
        case "Edge":
          return "fa-brands fa-edge";
        case "IE":
          return "fa-brands fa-internet-explorer";
        case "Chrome":
        case "Chrome WebView":
        case "Chromium":
          return "fa-brands fa-chrome";
        case "Mobile Safari":
        case "Safari":
          return "fa-brands fa-safari";
        case "Mozilla":
          return "fa-brands fa-firefox";
        case "Opera Coast":
        case "Opera [Mini/Mobi/Tablet]":
          return "fa-brands fa-opera";
        case "Yandex":
          return "fa-brands fa-yandex";
        default:
          return "fa-solid fa-globe";
      }
    };

    return {
      isOpenDeviceModal,
      deleteDevices,
      getDeviceIcon,
      showDeviceModal,
    };
  },
};
</script>

<style></style>
