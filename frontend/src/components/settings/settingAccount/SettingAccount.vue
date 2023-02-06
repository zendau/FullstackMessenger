<template>
  <section
    section
    class="user__container"
  >
    <h1 class="user__title">
      Hello {{ userData.login }}
    </h1>
    <p class="user__text">
      Email: {{ userData.email }}
    </p>
    <p class="user__text">
      Role: {{ userData.role }}
    </p>
    <hr class="user__hr">
    <h2 class="user__title">
      Change user data
    </h2>
    <AlertNotification />
    <ConfirmCode
      v-if="isConfirmCode"
      :email="userData.email"
      @confirm-code-event="confirmChangeData"
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
      <form-input
        id="login"
        v-model="login"
        title="Login"
        type="text"
      />
      <form-input
        id="phoneNumber"
        v-model="phoneNumber"
        title="Phone Number"
        type="text"
      />
      <form-input
        id="userDetails"
        v-model="userDetails"
        title="User Details"
        type="text"
      />
      <form-input
        id="password"
        v-model="password"
        autocomplete="new-password"
        title="Password"
        type="password"
      />
      <form-input
        id="confirmPassword"
        v-model="confirmPassword"
        title="Confirm password"
        type="password"
      />

      <input
        type="submit"
        value="Change data"
        :disabled="enableChangeData"
      >
    </form>
  </section>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import FormInput from "@/components/UI/FormInput.vue";
import AlertNotification from "@/components/UI/AlertNotification.vue";

import ConfirmCode from "@/components/ConfirmCode.vue";

export default {
  components: { AlertNotification, FormInput, ConfirmCode },
  setup() {
    const store = useStore();

    const userId = store.state.auth.user.id;
    const userEmail = store.state.auth.user.email;

    const userData = computed(() => store.state.auth.user);
    const updatedUserData = ref(null);
    const isConfirmCode = ref(false);

    const phoneRegExp =
      /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

    const schema = yup.lazy((value) =>
      yup.object().shape({
        email: value.email?.length > 0 && yup.string().email(),
        login: value.login?.length > 0 && yup.string().nullable().notRequired().min(6),
        userDetails: value.userDetails?.length > 0 && yup.string().nullable().notRequired().min(6),
        phoneNumber: value.phoneNumber?.length > 0 && yup.string().matches(phoneRegExp, "Phone number is not valid"),
        password: value.password?.length > 0 && yup.string().nullable().notRequired().min(6),
        confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
      })
    );

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: email } = useField("email", {}, { initialValue: userData.value.email });
    const { value: login } = useField("login", {}, { initialValue: userData.value.login });
    const { value: password } = useField("password", {}, { initialValue: "" });
    const { value: confirmPassword } = useField("confirmPassword", {}, { initialValue: "" });
    const { value: phoneNumber } = useField("phoneNumber", {}, { initialValue: userData.value.info.phone });
    const { value: userDetails } = useField("userDetails", {}, { initialValue: userData.value.info.details });

    function onInvalidSubmit({ errors }) {
      const errorMessage = Object.keys(errors)
        .map((error) => `<span>${errors[error]}</span>`)
        .join("");
      store.commit("alert/setErrorMessage", errorMessage);
    }

    const onSubmitForm = handleSubmit((value) => {
      console.log("value", value);
      updatedUserData.value = value;
      isConfirmCode.value = true;
      store.commit("alert/clearAlert");
    }, onInvalidSubmit);

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

    const enableChangeData = computed(() => {
      if (
        email.value?.length > 0 ||
        login.value?.length > 0 ||
        password.value?.length > 0 ||
        confirmPassword.value?.length > 0
      ) {
        return false;
      }
      return true;
    });

    return {
      userData,
      email,
      login,
      password,
      confirmPassword,
      onSubmitForm,
      enableChangeData,
      isConfirmCode,
      confirmChangeData,
      phoneNumber,
      userDetails,
    };
  },
};
</script>
