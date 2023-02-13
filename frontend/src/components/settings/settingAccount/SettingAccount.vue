<template>
  <section
    section
    class="user__container"
  >
    <h1 class="user__title">
      {{ $t("setting.settingAccount.hello") }} {{ userData.login }}
    </h1>
    <p class="user__text">
      {{ $t("setting.settingAccount.role") }} {{ userData.role }}
    </p>
    <hr class="user__hr">
    <h2 class="user__title">
      {{ $t("setting.settingAccount.change") }}
    </h2>
    <AlertNotification />
    <ConfirmCode
      v-if="isConfirmCode"
      :email="userData.email"
      @confirm-code-event="confirmChangeData"
    />
    <AccountForm
      v-else
      :user-data="userData"
    />
  </section>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import AlertNotification from "@/components/UI/AlertNotification.vue";

import ConfirmCode from "@/components/ConfirmCode.vue";
import AccountForm from "./AccountForm.vue";

export default {
  components: { AccountForm, AlertNotification, ConfirmCode },
  setup() {
    const store = useStore();

    const userId = store.state.auth.user.id;
    const userEmail = store.state.auth.user.email;

    const userData = computed(() => store.state.auth.user);
    const updatedUserData = ref(null);
    const isConfirmCode = ref(false);

    function confirmChangeData(confirmCode) {
      console.log({
        id: userId,
        ...updatedUserData.value,
        email: userEmail,
        newEmail: updatedUserData.value.email,
        confirmCode,
      });
      store.dispatch("auth/changeUserData", {
        id: userId,
        ...updatedUserData.value,
        email: userEmail,
        newEmail: updatedUserData.value.email,
        confirmCode,
      });
    }

    return {
      userData,
      isConfirmCode,
      confirmChangeData,
    };
  },
};
</script>
