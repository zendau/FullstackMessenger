<template>
    <component :is="authLayout">
      <router-view/>
    </component>
</template>

<script>


import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

import AuthMainLayout from './layout/auth.main.layout.vue'
import AuthChatLayout from './layout/auth.chat.layout.vue'
import noAuthLayoutVue from './layout/noAuth.layout.vue'

import { Layout } from './router/layouts'
import { useRoute } from 'vue-router'

export default {
  components: {},
  setup() {

    const store = useStore()

    
    store.dispatch('auth/checkAuth')

    //const router = useRouter()
    //router.push('/room/all')

    const layouts = new Map()

    layouts.set(Layout.Chat, AuthChatLayout)
    layouts.set(Layout.Main, AuthMainLayout)
    layouts.set(Layout.NoAuth, noAuthLayoutVue)


    const authStatus = computed(() => store.getters['auth/getAuthStatus'])


    const route = useRoute()
    const authLayout = computed(() => {
      if (authStatus) {
        return layouts.get(route.meta.layout)
      }

      return noAuthLayoutVue
    })

    return {
      authLayout
    }
  },
}
</script>

<style lang="scss">

body {
  background-color: $menuColor;
}

* {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}
</style>

