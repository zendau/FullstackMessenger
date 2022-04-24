<template>
  <p v-if="errorMessage">{{errorMessage}}</p>
  <form action="" @submit.prevent="onSubmitForm">
      <input type="text" placeholder="email" v-model.trim="email" required>
      <input type="password" placeholder="password" v-model.trim="password" required>
      <button>Login</button>
  </form>
</template>

<script>

import { ref } from 'vue'

import { useStore } from 'vuex'

export default {
    setup() {
        
        const email = ref(null)
        const password = ref(null)

        const errorMessage = ref(null)

        const store = useStore()



        async function onSubmitForm() {

            console.log(email.value, password.value)

            store.dispatch('auth/login', {
                email: email.value,
                password: password.value,
            })

       
        }

        return {
            email,
            password,
            onSubmitForm,
            errorMessage
        }
    }
}
</script>

<style>
    form {
        width: 400px;
        display: grid;
        row-gap: 5px;
    }
</style>