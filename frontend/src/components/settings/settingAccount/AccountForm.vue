<template>
  <form
    class="user__form"
    @submit="onSubmitForm"
  >
    <form-input
      id="email"
      v-model="email"
      name="email"
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
    >
  </form>
</template>

<script>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";

import FormInput from "@/components/UI/FormInput.vue";

export default {
  components: { FormInput },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  emits: ["setFormData"],
  setup(props) {
    const store = useStore();

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

    const { value: email } = useField("email", {}, { initialValue: props.userData.email });
    const { value: login } = useField("login", {}, { initialValue: props.userData.login });
    const { value: password } = useField("password", {}, { initialValue: "" });
    const { value: confirmPassword } = useField("confirmPassword", {}, { initialValue: "" });
    const { value: phoneNumber } = useField("phoneNumber", {}, { initialValue: props.userData.info.phone });
    const { value: userDetails } = useField("userDetails", {}, { initialValue: props.userData.info.details });

    function onInvalidSubmit({ errors }) {
      console.log("errors", errors);
      const errorMessage = Object.keys(errors)
        .map((error) => `<span>${errors[error]}</span>`)
        .join("");
      store.commit("alert/setErrorMessage", errorMessage);
    }

    const onSubmitForm = handleSubmit((value) => {
      console.log("value", value);
      // emit("setFormData", value, true);
      store.commit("alert/clearAlert");
    }, onInvalidSubmit);

    return {
      email,
      login,
      phoneNumber,
      userDetails,
      password,
      confirmPassword,
      onSubmitForm,
    };
  },
};
</script>

<style></style>
