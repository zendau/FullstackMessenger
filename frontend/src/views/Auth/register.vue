<template>
  <h1 class="user__title">Register</h1>
  <alert />
  <confirm-code v-if="isConfirmCode" @confirmCode="confirmRegister" />
  <form v-else class="user__form" @submit="onSubmitForm">

    <form-input id="email" title="Email" type="email" v-model="email" />
    <form-input id="password" title="Password" type="password" v-model="password" />
    <form-input id="ConfirmPassword" title="Confirm password" type="password" v-model="confirmPassword" />

    <input type="submit" value="Register">
  </form>
</template>

<script>

import Alert from '../../components/UI/alert.vue'
import FormInput from '../../components/UI/input.vue'

import { useStore } from 'vuex'

import confirmCode from '../../components/confirmCode.vue';

import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';

export default {
  components: { Alert, FormInput, confirmCode },
  setup() {

    const store = useStore()

    const isConfirmCode = ref(false)
    let registerData = null


    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
      confirmPassword: yup.string().required().oneOf([yup.ref('password'), null], 'Passwords must match'),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });


    const { value: email } = useField('email');
    const { value: password } = useField('password');
    const { value: confirmPassword } = useField('confirmPassword');


    function onInvalidSubmit({ errors }) {

      console.log('errors', errors)

      let message = ''

      if (errors.email) message += `${errors.email}\n`
      if (errors.password) message += `${errors.password}\n`
      if (errors.confirmPassword) message += errors.confirmPassword

      store.commit('auth/setErrorMessage', message)
    }

    const onSubmitForm = handleSubmit(value => {

      registerData = {
        email: value.email,
        password: value.password,
        confirmPassword: value.confirmPassword
      }

      isConfirmCode.value = true
      store.commit('auth/clearMessage')
      //store.dispatch('auth/register', )
    }, onInvalidSubmit)


    function confirmRegister(code) {
      console.log('confirm register ', code, registerData)
    }

    return {
      onSubmitForm,
      email,
      password,
      confirmPassword,
      isConfirmCode,
      confirmRegister
    }
  }
}
</script>

<style>
</style>