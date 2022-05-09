<template>
    <component :is="getLayout">
      <router-view/>
    </component>
</template>

<script>

//import { useRouter } from 'vue-router'

import authLayout from './layout/auth.layout.vue'
import mainLayout from './layout/main.layout.vue'

import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  components: {authLayout},
  setup() {

    const store = useStore()

    
    store.dispatch('auth/checkAuth')

    //const router = useRouter()
    //router.push('/room/all')

    const getLayout = computed(() => store.getters['auth/getAuthStatus'] ? authLayout : mainLayout )

    return {
      getLayout
    }
  },
}
</script>

<style lang="scss">

* {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}
</style>

