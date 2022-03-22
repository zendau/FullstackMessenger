<template>
<router-view></router-view>
</template>

<script>

import { useRouter, useRoute } from 'vue-router'

export default {
    setup() {
        const router = useRouter()
        const route = useRoute()

        if (route.fullPath === '/room') router.push('/room/all')
    }
}
</script>

<style>

</style>