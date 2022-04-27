<template>
  <p v-if="errorMessage">{{errorMessage}}</p>
</template>

<script>
import { computed } from '@vue/runtime-core'

import { useStore } from 'vuex'

export default {
    setup() {
        const store = useStore()
        return {
            errorMessage: computed(() => store.getters['auth/getErrorMessage'])
        }
    }
}
</script>

<style>

</style>