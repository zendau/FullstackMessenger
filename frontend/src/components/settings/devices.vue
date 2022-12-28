<template>
  <div style="color: gray">
    <h1>current</h1>

    <device :deviceData="currenteDevice" />
  </div>
  <h1>OTHER SESSIONS</h1>
  <ul>
    <li style="color: white" v-for="device in othersDevices" :key="device.id">
      <device :deviceData="device" />
      <!-- <p>{{ device.osVersion }}</p> -->
      <!-- <p>{{ device.ipAdress }}</p> -->
      <hr />
    </li>
  </ul>
</template>

<script>
import { computed, reactive } from "@vue/runtime-core";
import { useStore } from "vuex";
import device from "./devices/device.vue";

export default {
  components: { device },
  setup() {
    const store = useStore();

    const deviceId = computed(() => store.state.auth.user.deviceId);
    const devicesData = computed(() => store.state.auth.devices);

    const othersDevices = reactive([]);
    const currenteDevice = computed(
      () =>
        devicesData.value.filter((device) => {
          if (device.id === deviceId.value) return device;
          console.log("PUSH", device);
          othersDevices.push(device);
          return false;
        })[0]
    );

    store.dispatch("auth/getUserDevices");

    return {
      deviceId,
      othersDevices,
      currenteDevice,
    };
  },
};
</script>

<style></style>
