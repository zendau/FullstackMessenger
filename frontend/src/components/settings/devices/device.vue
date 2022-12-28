<template>
  <div v-if="deviceData">
    <p>{{ deviceData.osName }}</p>
    <p>{{ deviceData.brand }} - {{ deviceData.model }}</p>
    <p>{{ deviceData.lastOnline }}</p>
    <font-awesome-icon
      :icon="getDeviceIcon(deviceData.brand, deviceData.osName)"
    />
  </div>
</template>

<script>
export default {
  props: ["deviceData"],
  setup() {
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
      getDeviceIcon,
    };
  },
};
</script>

<style></style>
