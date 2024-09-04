<template>
  <h1 class="user__title">
    {{ $t("view.forgotPage.title") }}
  </h1>
  <AlertNotification />
  <ConfirmCode
    v-if="isConfirmCode"
    :email="tempEmail"
    @confirm-code-event="confirmResetPassword"
  />
  <form
    v-else
    class="user__form"
    @submit="onSubmitForm"
  >
    <form-input
      id="email"
      v-model="email"
      :title="$t('view.forgotPage.email')"
      type="email"
    />
    <input
      type="submit"
      :value="$t('view.forgotPage.submit')"
    />
  </form>
</template>

<script>
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import { useStore } from "vuex";
import { computed, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import onInvalidSubmit from "@/utils/onInvalidSubmit";

import AlertNotification from "@/components/UI/AlertNotification.vue";
import FormInput from "@/components/UI/FormInput.vue";
import ConfirmCode from "@/components/ConfirmCode.vue";

export default {
  components: { AlertNotification, FormInput, ConfirmCode },
  setup() {
    const store = useStore();
    const isConfirmCode = computed(() => store.state.auth.isConfirmCode);
    const tempEmail = ref(null);

    const { t } = useI18n();

    const schema = yup.object({
      email: yup.string().required().email().label(t("view.forgotPage.email")),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: email } = useField("email");

    onUnmounted(() => {
      store.commit("alert/hotClearAlert");
    });

    const onSubmitForm = handleSubmit((value) => {
      tempEmail.value = value.email;
      store.commit("alert/clearAlert");
      store.dispatch("auth/checkEmail", {
        email: value.email,
        isFind: true,
      });
    }, onInvalidSubmit);

    function confirmResetPassword(confirmCode) {
      store.dispatch("auth/resetPassword", {
        email: tempEmail.value,
        confirmCode,
      });
    }

    return {
      email,
      isConfirmCode,
      tempEmail,
      onSubmitForm,
      confirmResetPassword,
    };
  },
};
</script>

<style></style>
