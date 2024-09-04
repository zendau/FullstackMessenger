<template>
  <form
    class="user__form"
    @submit.prevent="onSubmitForm"
  >
    <form-input
      id="code"
      v-model="confirmCode"
      :title="$t('ui.confirmCode.title')"
      type="text"
    />
    <input
      type="submit"
      :value="$t('ui.confirmCode.btn')"
    />
  </form>
</template>

<script>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
import { onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import onInvalidSubmit from "@/utils/onInvalidSubmit";

import FormInput from "./UI/FormInput.vue";
export default {
  components: { FormInput },
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  emits: ["confirm-code-event"],
  setup(props, ctx) {
    const store = useStore();

    const { t } = useI18n();

    const schema = yup.object({
      confirmCode: yup.string().required().label(t("ui.confirmCode.title")),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    onMounted(() => {
      store.dispatch("auth/confirmCode", props.email);
    });

    onUnmounted(() => {
      store.commit("auth/setIsConfirmCode", false);
      store.commit("alert/hotClearAlert");
    });

    const { value: confirmCode } = useField("confirmCode");

    const onSubmitForm = handleSubmit((value) => {
      ctx.emit("confirm-code-event", value.confirmCode);
    }, onInvalidSubmit);

    return {
      confirmCode,
      onSubmitForm,
    };
  },
};
</script>
