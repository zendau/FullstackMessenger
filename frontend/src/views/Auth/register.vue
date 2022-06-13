<template>
  <h1 class="user__title">Register</h1>
  <alert />
  <confirm-code v-if="isConfirmCode" @confirmCode="confirmRegister" :email="registerData.email" />
  <form v-else class="user__form" @submit.prevent="onSubmitForm">

    <form-input id="email" title="Email" type="email" v-model="email" />
    <form-input id="login" title="Login" type="text" v-model="login" />
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

    const registerData = ref(null)

    const isConfirmCode = ref(false)

    const schema = yup.object({
      email: yup.string().required().email(),
      login: yup.string().required().min(6),
      password: yup.string().required().min(6),
      confirmPassword: yup.string().required().oneOf([yup.ref('password'), null], 'Passwords must match'),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });


    const { value: email } = useField('email');
    const { value: login } = useField('login');
    const { value: password } = useField('password');
    const { value: confirmPassword } = useField('confirmPassword');


    function onInvalidSubmit({ errors }) {
      const errorMessage = Object.keys(errors).map(error => `<span>${errors[error]}</span>`).join('')
      store.commit('auth/setErrorMessage', errorMessage)
    }

    const onSubmitForm = handleSubmit(value => {

      registerData.value = value
      isConfirmCode.value = true
      store.commit('auth/clearMessage')
      //store.dispatch('auth/register', )
    }, onInvalidSubmit)


    function confirmRegister(confirmCode) {
      store.dispatch('auth/register', {
        ...registerData.value,
        confirmCode
      })
    }

    return {
      onSubmitForm,
      email,
      login,
      password,
      confirmPassword,
      isConfirmCode,
      confirmRegister,
      registerData
    }
  }
}
</script>

<style>
</style>