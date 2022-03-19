<template>
  
  <div>Room title - {{roomData.roomTitle}}</div>
  <div>Room author - {{roomData.adminLogin}}</div>
  <div>Room id - {{roomData.roomId}}</div>
</template>

<script>
import { useRoute } from 'vue-router'
import {  reactive } from 'vue'

import $api from '../axios'

export default {
    async setup() {
        //const router = useRouter()
        const route = useRoute()

        const res = await $api.get('/room/get/'+route.params.id)
        const roomData = reactive(res.data)
        


        return {
            roomData
        }
    }
}
</script>

<style>

</style>