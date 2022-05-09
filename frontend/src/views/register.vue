<template>
  <error-message/>
  <form action="" @submit.prevent="onSubmitForm">
      <input type="text" placeholder="email" v-model.trim="email" required>
      <input type="password" placeholder="password" v-model.trim="password" required>
      <input type="password" placeholder="confirm password" v-model.trim="confirmPassword" required>
      <button>Registration</button>
  </form>
</template>

<script>

import { ref } from 'vue'

import { useStore } from 'vuex'
import errorMessage from '../components/errorMessage.vue'

export default {
  components: { errorMessage },
    setup() {
        
        const email = ref(null)
        const password = ref(null)
        const confirmPassword = ref(null)

        const errorMessage = ref(null)

        const store = useStore()



        async function onSubmitForm() {

            if (password.value === confirmPassword.value) {
                console.log(email.value, password.value, confirmPassword.value)

                store.dispatch('auth/register', {
                  email: email.value,
                  password: password.value,
                  confirmPassword: confirmPassword.value
                })

            } else {
                errorMessage.value = 'Passwords do not match'
            }
        }

        return {
            email,
            password,
            confirmPassword,
            onSubmitForm,
            errorMessage
        }
    }
}
</script>

<style>

</style>