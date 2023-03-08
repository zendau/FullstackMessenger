<template>
  <h1 class="user__title">
    {{ $t("view.registerPage.title") }}
  </h1>
  <AlertNotification />
  <ConfirmCode
    v-if="isConfirmCode"
    :email="registerData.email"
    @confirm-code-event="confirmRegister"
  />
  <form
    v-else
    class="user__form"
    @submit.prevent="onSubmitForm"
  >
    <form-input
      id="email"
      v-model="email"
      :title="$t('view.registerPage.email')"
      type="email"
    />
    <form-input
      id="login"
      v-model="login"
      :title="$t('view.registerPage.login')"
      type="text"
    />
    <form-input
      id="password"
      v-model="password"
      :title="$t('view.registerPage.password')"
      type="password"
    />
    <form-input
      id="ConfirmPassword"
      v-model="confirmPassword"
      :title="$t('view.registerPage.confirmPassword')"
      type="password"
    />

    <input
      type="submit"
      :value="$t('view.registerPage.submit')"
    >
  </form>
</template>

<script>
import { useStore } from "vuex";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { computed, ref } from "vue";
import onInvalidSubmit from "@/utils/onInvalidSubmit";
import { useI18n } from "vue-i18n";

import ConfirmCode from "@/components/ConfirmCode.vue";
import AlertNotification from "@/components/UI/AlertNotification.vue";
import FormInput from "@/components/UI/FormInput.vue";
export default {
  components: { AlertNotification, FormInput, ConfirmCode },
  setup() {
    const store = useStore();
    const { t } = useI18n();

    const registerData = ref(null);
    const isConfirmCode = computed(() => store.state.auth.isConfirmCode);

    const schema = yup.object({
      email: yup.string().required().email().label(t("view.registerPage.email")),
      login: yup.string().required().min(6).label(t("view.registerPage.login")),
      password: yup.string().required().min(6).label(t("view.registerPage.password")),
      confirmPassword: yup
        .string()
        .required()
        .oneOf([yup.ref("password"), null], t("yup.string.oneOf"))
        .label(t("view.registerPage.confirmPassword")),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: email } = useField("email");
    const { value: login } = useField("login");
    const { value: password } = useField("password");
    const { value: confirmPassword } = useField("confirmPassword");

    const onSubmitForm = handleSubmit((value) => {
      registerData.value = value;
      store.commit("alert/clearAlert");

      store.dispatch("auth/checkEmail", {
        email: value.email,
        isFind: false,
      });
    }, onInvalidSubmit);

    function confirmRegister(confirmCode) {
      store.dispatch("auth/register", {
        ...registerData.value,
        confirmCode,
      });
    }

    return {
      onSubmitForm,
      email,
      login,
      password,
      confirmPassword,
      isConfirmCode,
      registerData,
      confirmRegister,
    };
  },
};
</script>

<style></style>
