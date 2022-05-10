<template>
  <h1 class="user__title">Hello Admin</h1>
  <p class="user__role">Role: <span>Admin</span></p>
  <hr class="user__hr">
  <h2 class="user__title">Change user data</h2>
  <div class="alert alert__success">
      <p class="alert__text">Data is changed</p>
  </div>
  <form class="user__form">
      <label for="conferenceTitle">Login</label>
      <input type="text" id="conferenceTitle" placeholder="Login">
      <label for="conferenceTitle">New password</label>
      <input type="password" id="conferenceTitle" placeholder="password">
      <label for="conferenceTitle">Repeat new password</label>
      <input type="password" id="conferenceTitle" placeholder="password">
      <input type="submit" value="Change data">
  </form>
</template>

<script>
import { computed } from '@vue/runtime-core'

import { useStore } from 'vuex'

export default {
    setup() {
        const store = useStore()

        return {
            userData: computed(() => store.getters['auth/getUserData'])
        }
    }
}
</script>

<style>

</style>