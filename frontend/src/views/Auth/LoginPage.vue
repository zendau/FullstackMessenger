<template>
  <h1 class="user__title">
    Login
  </h1>
  <AlertNotification />
  <form
    class="user__form"
    @submit="onSubmitForm"
  >
    <form-input
      id="email"
      v-model="email"
      title="Email"
      type="email"
    />
    <form-input
      id="password"
      v-model="password"
      title="Password"
      type="password"
    />
    <input
      type="submit"
      value="Login"
    >
  </form>
  <hr class="user__hr">
  <router-link
    class="user__link"
    to="/forgot"
  >
    Forgot your password
  </router-link>
</template>

<script>
import { useStore } from "vuex";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import FormInput from "@/components/UI/FormInput.vue";
import AlertNotification from "@/components/UI/AlertNotification.vue";
export default {
  components: { AlertNotification, FormInput },
  setup() {
    const store = useStore();

    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(6),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { errorMessage: errorMessageEmail, value: email } = useField("email");
    const { errorMessage: errorMessagePassword, value: password } = useField("password");

    function onInvalidSubmit({ errors }) {
      const errorMessage = Object.keys(errors)
        .map((error) => `<span>${errors[error]}</span>`)
        .join("");
      store.commit("alert/setErrorMessage", errorMessage);
    }

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
