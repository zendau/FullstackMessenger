<template>
  <section section class="user__container">
    <h1 class="user__title">Hello {{ userData.email }}</h1>
    <p class="user__role">Role: {{ userData.role.value }}</p>
    <hr class="user__hr">
    <h2 class="user__title">Change user data</h2>
    <alert />
    <form class="user__form" @submit="onSubmitForm">
      <form-input id="email" title="Email" type="email" v-model="email" />
      <form-input id="password" title="Password" type="password" v-model="password" />
      <form-input id="confirmPassword" title="Confirm password" type="password" v-model="password" />
      <input type="submit" value="Change data">
    </form>
  </section>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'

import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

import FormInput from '../components/UI/input.vue'
import Alert from '../components/UI/alert.vue'

export default {
  components: { Alert, FormInput },
  setup() {
    const store = useStore()

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
      let message = ''

      if (errors.email) message += `${errors.email}\n`
      if (errors.password) message += `${errors.password}\n`
      if (errors.confirmPassword) message += errors.confirmPassword

      store.commit('auth/setErrorMessage', message)
    }

    const onSubmitForm = handleSubmit(value => {
      console.log(value)
      // store.dispatch('auth/register', {
      //   email: value.email,
      //   password: value.password,
      //   confirmPassword: value.confirmPassword
      // })
    }, onInvalidSubmit)

    return {
      userData: computed(() => store.getters['auth/getUserData']),
      onSubmitForm,
      email,
      password,
      confirmPassword
    }
  }
}
</script>


<style lang="scss" scoped>
.user {
  &__container {
    width: 600px;
    background-color: $bgcColor;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    color: $textColor;
    border-radius: 3px;
    padding: 15px 0;
  }

  &__title {
    text-align: center;
    margin: 25px 0;
    color: $textColor;
  }

  &__hr {
    width: 80%;
    margin: 35px auto;
    border-color: $secondTextColor;
  }

  &__role {
    text-align: center;
  }

  &__link {
    align-self: center;
    color: $linkColor;
    text-decoration: none;
    margin-bottom: 15px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    margin-top: 20px;

    &::v-deep {
      label {
        margin-bottom: 5px;
        color: $textColor;
      }

      input {
        border: none;
        outline: none;
        color: $textColor;
        padding: 5px;
        font-size: 18px;
        margin-bottom: 20px;

        &::placeholder {
          color: $textColor;
        }
      }

      input[type='submit'] {
        background-color: $btnChat;
        transition: .3s ease;
        cursor: pointer;

        &:hover {
          background-color: $btnHover;
        }
      }

      select,
      input {
        width: 200px;
        font-size: 16px;
        background-color: #242f3d;
      }

      select {
        margin: 15px 0;

        border: none;
        outline: none;
        color: $textColor;
        border-radius: 0;
      }
    }


  }
}

@media (max-width: 720px) {

  .user {
    &__container {
      width: 90%;
      margin: 15px auto;
      box-sizing: border-box;
    }
  }

}
</style>