<template>
  <form
    class="user__form"
    @submit="onSubmitForm"
  >
    <form-input
      id="email"
      v-model="email"
      :title="$t('setting.accountForm.email')"
      type="email"
    />
    <form-input
      id="login"
      v-model="login"
      :title="$t('setting.accountForm.login')"
      type="text"
    />
    <form-input
      id="phoneNumber"
      v-model="phoneNumber"
      :title="$t('setting.accountForm.phone')"
      type="text"
    />
    <form-input
      id="userDetails"
      v-model="userDetails"
      :title="$t('setting.accountForm.details')"
      type="text"
    />
    <form-input
      id="password"
      v-model="password"
      autocomplete="new-password"
      :title="$t('setting.accountForm.password')"
      type="password"
    />
    <form-input
      id="confirmPassword"
      v-model="confirmPassword"
      :title="$t('setting.accountForm.confirmPassword')"
      type="password"
    />

    <input
      type="submit"
      :value="$t('setting.accountForm.changeBtn')"
    />
  </form>
</template>

<script>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

import FormInput from "@/components/UI/FormInput.vue";
import { computed, onUnmounted } from "vue";
import onInvalidSubmit from "@/utils/onInvalidSubmit";

export default {
  components: { FormInput },
  emits: ["initChangeData"],
  setup(_, { emit }) {
    const store = useStore();
    const { t } = useI18n();

    const userData = computed(() => store.state.auth.user);

    const phoneRegExp =
      /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

    const schema = yup.lazy((value) =>
      yup.object().shape({
        email:
          value.email?.length > 0 &&
          yup.string().email().label(t("setting.accountForm.email")),
        login:
          value.login?.length > 0 &&
          yup
            .string()
            .nullable()
            .notRequired()
            .min(6)
            .label(t("setting.accountForm.login")),
        userDetails:
          value.userDetails?.length > 0 &&
          yup
            .string()
            .nullable()
            .notRequired()
            .min(6)
            .label(t("setting.accountForm.details")),
        phoneNumber:
          value.phoneNumber?.length > 0 &&
          yup
            .string()
            .matches(phoneRegExp, "Phone number is not valid")
            .label(t("setting.accountForm.phone")),
        password:
          value.password?.length > 0 &&
          yup
            .string()
            .nullable()
            .notRequired()
            .min(6)
            .label(t("setting.accountForm.password")),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password"), null], "Passwords must match")
          .label(t("setting.accountForm.confirmPassword")),
      })
    );

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: email } = useField(
      "email",
      {},
      { initialValue: userData.value.email }
    );
    const { value: login } = useField(
      "login",
      {},
      { initialValue: userData.value.login }
    );
    const { value: password } = useField("password", {}, { initialValue: "" });
    const { value: confirmPassword } = useField(
      "confirmPassword",
      {},
      { initialValue: "" }
    );
    const { value: phoneNumber } = useField(
      "phoneNumber",
      {},
      { initialValue: userData.value.info?.phone }
    );
    const { value: userDetails } = useField(
      "userDetails",
      {},
      { initialValue: userData.value.info?.details }
    );

    onUnmounted(() => {
      store.commit("alert/hotClearAlert");
    });

    const onSubmitForm = handleSubmit((changeData) => {

      const newUserData = {};

      if (changeData?.email !== userData.value.email) {
        newUserData.email = changeData.email;
      }

      if (changeData?.login !== userData.value.login) {
        newUserData.login = changeData.login;
      }

      if (changeData?.phoneNumber !== userData.value.info.phone) {
        newUserData.phoneNumber = changeData.phoneNumber;
      }

      if (changeData?.userDetails !== userData.value.info.details) {
        newUserData.userDetails = changeData.userDetails;
      }

      if (changeData?.password && changeData?.confirmPassword) {
        newUserData.password = changeData.password;
      }

      emit("initChangeData", newUserData);
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
