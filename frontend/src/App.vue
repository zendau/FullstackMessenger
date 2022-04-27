<template>
  <suspense>
    <component :is="getLayout">
      <router-view/>
    </component>
  </suspense>
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

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

body {
  background-color: #dddddd;
  margin: 0;
}
</style>

