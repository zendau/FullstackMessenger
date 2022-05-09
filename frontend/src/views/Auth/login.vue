<template>
    <h1 class="user__title">Login</h1>
    <alert/>
    <form class="user__form" @submit.prevent="onSubmitForm">
        <form-input id="email" title="Email" type="email" v-model="email"/>
        <form-input id="password" title="Password" type="password"/>

        <input type="submit" value="Login"/>
    </form>
    <hr class="user__hr">
    <router-link class="user__link" to="/forgot">Forgot your password</router-link>
</template>

<script>

import Alert from '../../components/UI/alert.vue'
import FormInput from '../../components/UI/input.vue'

import { useStore } from 'vuex'
import {ref} from 'vue'

export default {
    components: {Alert, FormInput},
    setup() {

        const email = ref(null)
        const password = ref(null)

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
        }

    }
}
</script>

<style>

</style>