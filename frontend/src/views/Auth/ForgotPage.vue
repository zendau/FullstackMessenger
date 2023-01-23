<template>
  <h1 class="user__title">
    Forgot password
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
      title="Email"
      type="email"
    />
    <input
      type="submit"
      value="Send"
    >
  </form>
</template>

<script>
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import { useStore } from "vuex";
import { onUnmounted, ref } from "vue";

import AlertNotification from "@/components/UI/alertNotification.vue";
import FormInput from "@/components/UI/input.vue";
import ConfirmCode from "@/components/confirmCode.vue";

export default {
  components: { AlertNotification, FormInput, ConfirmCode },
  setup() {
    const store = useStore();
    const isConfirmCode = ref(false);
    const tempEmail = ref(null);

    onUnmounted(() => {
      store.commit("alert/clearAlert");
    });

    const schema = yup.object({
      email: yup.string().required().email(),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: email } = useField("email");

    function onInvalidSubmit({ errors }) {
      const errorMessage = Object.keys(errors)
        .map((error) => `<span>${errors[error]}</span>`)
        .join("");
      store.commit("alert/setErrorMessage", errorMessage);
    }

    const onSubmitForm = handleSubmit((value) => {
      tempEmail.value = value.email;
      isConfirmCode.value = true;
      store.commit("alert/clearAlert");
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
