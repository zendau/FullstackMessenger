<template>
  <h1 class="user__title">
    {{ $t("setting.settingAccount.hello") }} {{ userData.login }}
  </h1>
  <p class="user__text">
    {{ $t("setting.settingAccount.role") }} {{ $t(`setting.role.${userData.role}`) }}
  </p>
  <hr class="user__hr">
  <h2 class="user__title">
    {{ $t("setting.settingAccount.change") }}
  </h2>
  <AlertNotification />
  <ConfirmCode
    v-show="isConfirmCode"
    :email="userData.email"
    @confirm-code-event="confirmChangeData"
  />
  <AccountForm
    v-show="!isConfirmCode"
    @init-change-data="initChangeData"
  />
</template>

<script>
import { computed, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import AlertNotification from "@/components/UI/AlertNotification.vue";

import ConfirmCode from "@/components/ConfirmCode.vue";
import AccountForm from "./AccountForm.vue";

export default {
  components: { AccountForm, AlertNotification, ConfirmCode },
  setup() {
    const store = useStore();

    const userData = computed(() => store.state.auth.user);
    const updatedUserData = ref(null);
    const isConfirmCode = ref(false);

    function initChangeData(newUserData) {
      isConfirmCode.value = true;
      updatedUserData.value = newUserData;
    }

    onUnmounted(() => {
      isConfirmCode.value = false;
    });

    function confirmChangeData(confirmCode) {
      console.log({
        ...updatedUserData.value,
        newEmail: updatedUserData.value.email,
        confirmCode,
      });
      store.dispatch("auth/changeUserData", {
        ...updatedUserData.value,
        newEmail: updatedUserData.value.email,
        confirmCode,
      });
      isConfirmCode.value = false;
    }

    return {
      userData,
      isConfirmCode,
      initChangeData,
      confirmChangeData,
    };
  },
};
</script>
