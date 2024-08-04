<template>
  <hr class="user__hr">
  <h2 class="user__title">
    {{ $t("setting.settingDevices.title") }}
  </h2>
  <div>
    <h3>{{ $t("setting.settingDevices.current") }}</h3>

    <Device
      :device-data="currenteDevice"
      :is-current="true"
    />

    <button
      class="setting__end"
      @click="deleteDevices()"
    >
      <font-awesome-icon icon="fa-solid fa-hand" />
      {{ $t("setting.settingDevices.endOther") }}
    </button>
  </div>
  <h3>{{ $t("setting.settingDevices.other") }}</h3>
  <ul v-if="othersDevices.length > 0">
    <li
      v-for="device in othersDevices"
      :key="device.id"
    >
      <Device
        :device-data="device"
        :is-current="false"
        @delete-devices="deleteDevices"
      />
    </li>
  </ul>
  <div
    v-else
    class="setting__empty"
  >
    {{ $t("setting.settingDevices.noSessions") }}
  </div>
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
    const currenteDevice = ref({});

    watch(
      () => store.state.auth.devices,
      (devices) => {
        console.log("watch", devices);
        othersDevices.length = 0;
        devices.forEach((device) => {
          console.log("device.id ", device.id, deviceId.value, deviceId.value === device.id);
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

<style lang="scss" scoped>
h3 {
  text-align: center;
  color: var(--color-links);
  margin: 15px;
}

.setting {
  &__end {
    color: var(--color-danger);
    border: none;
    background-color: inherit;
    font-size: 14px;
    margin: 15px auto 0;
    display: block;
    cursor: pointer;
  }

  &__empty {
    text-align: center;
  }
}

ul {
  list-style: none;
}

li {
  margin-bottom: 15px;
}
</style>
