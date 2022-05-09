<template>
  <h1 class="user__title">Register</h1>
  <alert :text="message" :type="type"/>
  <form class="user__form">

      <form-input id="email" title="Email" type="email"/>
      <form-input id="password" title="Password" type="password"/>
      <form-input id="ConfirmPassword" title="Confirm password" type="password"/>

      <input type="submit" value="Register">
  </form>
</template>

<script>

import Alert from '../../components/UI/alert.vue'
import FormInput from '../../components/UI/input.vue'

export default {
    components: {Alert, FormInput},
    setup() {

        const type = 'success'
        const message = 'Registered'

        return {
            type,
            message
        }
    }
}
</script>

<style>

</style>