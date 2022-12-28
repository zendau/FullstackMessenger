<template>
  <section section class="user__container">
    <h1 class="user__title">Hello {{ userData.login }}</h1>
    <p class="user__text">Email: {{ userData.email }}</p>
    <p class="user__text">Role: {{ userData.role.value }}</p>
    <hr class="user__hr">
    <h2 class="user__title">Change user data</h2>
    <alert />
    <confirm-code v-if="isConfirmCode" @confirmCode="confirmChangeData" :email="userData.email" />
    <form v-else class="user__form" @submit="onSubmitForm">
      <form-input id="email" title="Email" type="email" v-model="email" />
      <form-input id="login" title="Login" type="text" v-model="login" />
      <form-input  autocomplete="new-password" id="password" title="Password" type="password" v-model="password" />
      <form-input id="confirmPassword" title="Confirm password" type="password" v-model="confirmPassword" />
      <input type="submit" value="Change data" :disabled="enableChangeData">
    </form>
  </section>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

import FormInput from '../../components/UI/input.vue'
import Alert from '../../components/UI/alert.vue'

import confirmCode from '../../components/confirmCode.vue';

export default {
  components: { Alert, FormInput, confirmCode },
  setup() {
    const store = useStore()

    const userId = store.state.auth.user.id
    const userEmail = store.state.auth.user.email

    const userData = ref(null)
    const isConfirmCode = ref(false)

    const schema = yup.lazy((value) =>
      yup.object().shape({
        email: value.email?.length > 0 && yup.string().email(),
        login: value.login?.length > 0 && yup.string().nullable().notRequired().min(6),
        password: value.password?.length > 0 && yup.string().nullable().notRequired().min(6),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
      })
    );


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
      console.log('value', value)
      userData.value = value
      isConfirmCode.value = true
      store.commit('auth/clearAlert')
    }, onInvalidSubmit)

    function confirmChangeData(confirmCode) {
      console.log({
        id: userId,
        ...userData.value,
        email: userEmail,
        newEmail: userData.value.email,
        confirmCode,

      })
      store.dispatch('auth/changeUserData', {
        id: userId,
        ...userData.value,
        email: userEmail,
        newEmail: userData.value.email,
        confirmCode,

      })
    }

    const enableChangeData = computed(() => {
      if (
        email.value?.length > 0 ||
        login.value?.length > 0 ||
        password.value?.length > 0 ||
        confirmPassword.value?.length > 0
      ) {
        return false
      }
      return true
    })

    return {
      userData: computed(() => store.state.auth.user),
      email,
      login,
      password,
      confirmPassword,
      onSubmitForm,
      confirmChangeData,
      enableChangeData,
      isConfirmCode
    }
  }
}
</script>