<template>
  <form
    class="user__form"
    @submit.prevent="onSubmitForm"
  >
    <form-input
      id="code"
      v-model="confirmCode"
      title="Confirm code"
      type="text"
    />
    <input
      type="submit"
      value="Confirm"
    >
  </form>
</template>

<script>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
import { onMounted } from "vue";

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

    const schema = yup.object({
      confirmCode: yup.string().required(),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    onMounted(() => {
      store.dispatch("auth/confirmCode", props.email);
    });

    const { value: confirmCode } = useField("confirmCode");

    function onInvalidSubmit({ errors }) {
      store.commit("alert/setErrorMessage", errors.confirmCode);
    }

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
