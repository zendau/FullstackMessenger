<template>
  <h1 class="user__title">Forgot password</h1>
  <alert :text="message" :type="type"/>
  <form class="user__form">
      
      <form-input id="email" title="Email" type="email"/>
      <input type="submit" value="Send">
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