<template>
  <h1 class="user__title">
    Register
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
      title="Email"
      type="email"
    />
    <form-input
      id="login"
      v-model="login"
      title="Login"
      type="text"
    />
    <form-input
      id="password"
      v-model="password"
      title="Password"
      type="password"
    />
    <form-input
      id="ConfirmPassword"
      v-model="confirmPassword"
      title="Confirm password"
      type="password"
    />

    <input
      type="submit"
      value="Register"
    >
  </form>
</template>

<script>
import { useStore } from "vuex";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";

import ConfirmCode from "@/components/confirmCode.vue";
import AlertNotification from "@/components/UI/alertNotification.vue";
import FormInput from "@/components/UI/input.vue";
export default {
  components: { AlertNotification, FormInput, ConfirmCode },
  setup() {
    const store = useStore();

    const registerData = ref(null);
    const isConfirmCode = ref(false);

    const schema = yup.object({
      email: yup.string().required().email(),
      login: yup.string().required().min(6),
      password: yup.string().required().min(6),
      confirmPassword: yup
        .string()
        .required()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: email } = useField("email");
    const { value: login } = useField("login");
    const { value: password } = useField("password");
    const { value: confirmPassword } = useField("confirmPassword");

    function onInvalidSubmit({ errors }) {
      const errorMessage = Object.keys(errors)
        .map((error) => `<span>${errors[error]}</span>`)
        .join("");
      store.commit("alert/setErrorMessage", errorMessage);
    }

    const onSubmitForm = handleSubmit((value) => {
      registerData.value = value;
      isConfirmCode.value = true;
      store.commit("alert/clearAlert");
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
