<template>
  roomId - {{roomId}}
</template>

<script>

import {useRoute} from "vue-router"

export default {
    setup() {

        const route = useRoute()

        const roomId = route.params.id

        return {
            roomId
        }
    }
}
</script>

<style>

</style>