<template>
    <h1 class="user__title">Login</h1>
    <alert :text="message" :type="type"/>
    <form class="user__form">

        <form-input id="email" title="Email" type="email"/>
        <form-input id="password" title="Password" type="password"/>

        <input type="submit" value="Login"/>
    </form>
    <hr class="user__hr">
    <router-link class="user__link" to="/forgot">Forgot your password</router-link>
</template>

<script>

import Alert from '../../components/UI/alert.vue'
import FormInput from '../../components/UI/input.vue'

export default {
    components: {Alert, FormInput},
    setup() {

        const type = 'danger'
        const message = 'Email is not found'

        return {
            type,
            message
        }
    }
}
</script>

<style>

</style>