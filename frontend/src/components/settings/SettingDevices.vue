<template>
  <div style="color: gray">
    <h1>current</h1>

    <Device
      :device-data="currenteDevice"
      :is-current="true"
    />

    <button @click="deleteDevices()">
      End all other sessions
    </button>
  </div>
  <h1>OTHER SESSIONS</h1>
  <ul v-if="othersDevices.length > 0">
    <li
      v-for="device in othersDevices"
      :key="device.id"
      style="color: white"
    >
      <Device
        :device-data="device"
        :is-current="false"
        @delete-devices="deleteDevices"
      />
      <hr>
    </li>
  </ul>
  <div>No sessions</div>
</template>

<script>
import { computed, reactive, watch, ref } from "vue";
import { useStore } from "vuex";
import Device from "./devices/DeviceData.vue";

export default {
  components: { Device },
  setup() {
    const store = useStore();

    const deviceId = computed(() => store.state.auth.user.deviceId);

    const othersDevices = reactive([]);
    const currenteDevice = ref(null);

    watch(
      () => store.state.auth.devices,
      (devices) => {
        console.log("watch", devices);
        othersDevices.length = 0;
        devices.forEach((device) => {
          if (device.id === deviceId.value) currenteDevice.value = device;
          else othersDevices.push(device);
        });
      },
      {
        immediate: true,
      }
    );

    function deleteDevices(deviceId) {
      let devicesIdList = null;

      if (deviceId) {
        devicesIdList = deviceId;
      } else {
        devicesIdList = othersDevices.map((device) => device.id);
      }
      store.dispatch("auth/deleteDevices", devicesIdList);
    }

    store.dispatch("auth/getUserDevices");

    return {
      deviceId,
      othersDevices,
      currenteDevice,
      deleteDevices,
    };
  },
};
</script>

<style></style>
