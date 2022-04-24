<template>
  <div>
      <p>id - {{userData.id}}</p>
      <p>email - {{userData.email}}</p>
      <p>role - {{userData.role}}</p>
  </div>
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