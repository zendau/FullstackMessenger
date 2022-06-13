<template>
  <h1 class="user__title">Forgot password</h1>
  <alert />
  <confirm-code v-if="isConfirmCode" @confirmCode="confirmResetPassword" :email="tempEmail" />
  <form v-else class="user__form" @submit="onSubmitForm">
    <form-input id="email" title="Email" type="email" v-model="email" />
    <input type="submit" value="Send">
  </form>
</template>

<script>

import Alert from '../../components/UI/alert.vue'
import FormInput from '../../components/UI/input.vue'

import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';
import { useStore } from 'vuex';
import { onUnmounted, ref } from 'vue';

import confirmCode from '../../components/confirmCode.vue';

export default {
  components: { Alert, FormInput, confirmCode },
  setup() {

    const store = useStore()

    const schema = yup.object({
      email: yup.string().required().email()
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    const isConfirmCode = ref(false)
    const tempEmail = ref(null)

    const { value: email } = useField('email');

    onUnmounted(() => {
      store.commit('auth/clearMessage')
    })

    function onInvalidSubmit({ errors }) {
      const errorMessage = Object.keys(errors).map(error => `<span>${errors[error]}</span>`).join('')
      store.commit('auth/setErrorMessage', errorMessage)
    }

    const onSubmitForm = handleSubmit(value => {
      tempEmail.value =  value.email
      isConfirmCode.value = true
      store.commit('auth/clearMessage')
    }, onInvalidSubmit)

    function confirmResetPassword(confirmCode) {
      store.dispatch('auth/resetPassword', {
        email: tempEmail.value,
        confirmCode
      })
    }

    return {
      email,
      isConfirmCode,
      tempEmail,
      onSubmitForm,
      confirmResetPassword
    }
  }
}
</script>

<style>
</style>