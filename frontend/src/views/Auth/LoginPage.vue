<template>
  <h1 class="user__title">
    {{ $t("view.loginPage.title") }}
  </h1>
  <AlertNotification />
  <form
    class="user__form"
    @submit="onSubmitForm"
  >
    <form-input
      id="email"
      v-model="email"
      :title="$t('view.loginPage.email')"
      type="email"
    />
    <form-input
      id="password"
      v-model="password"
      :title="$t('view.loginPage.password')"
      type="password"
    />
    <input
      type="submit"
      :value="$t('view.loginPage.submit')"
    >
  </form>
  <hr class="user__hr">
  <router-link
    class="user__link"
    to="/forgot"
  >
    {{ $t("view.loginPage.forgot") }}
  </router-link>
</template>

<script>
import { useStore } from "vuex";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
import onInvalidSubmit from "@/utils/onInvalidSubmit";

import FormInput from "@/components/UI/FormInput.vue";
import AlertNotification from "@/components/UI/AlertNotification.vue";
export default {
  components: { AlertNotification, FormInput },
  setup() {
    const { t } = useI18n();

    const store = useStore();

    const schema = yup.object({
      email: yup.string().required().email().label(t("view.loginPage.email")),
      password: yup.string().required().min(6).label(t("view.loginPage.password")),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { errorMessage: errorMessageEmail, value: email } = useField("email");
    const { errorMessage: errorMessagePassword, value: password } = useField("password");

    const onSubmitForm = handleSubmit((value) => {
      store.commit("alert/clearAlert");
      store.dispatch("auth/login", {
        email: value.email,
        password: value.password,
      });
    }, onInvalidSubmit);

    return {
      email,
      password,
      onSubmitForm,
      errorMessageEmail,
      errorMessagePassword,
    };
  },
};
</script>

<style></style>
