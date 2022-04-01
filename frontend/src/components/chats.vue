<template>
   <ul>
    <li v-for="room in roomData" :key="room.id">
      <router-link :to="'/chat/'+room.chatId">Enter to room - {{room.chatId}}</router-link>
      {{room.roomId}}
    </li>
  </ul>
</template>

<script>

import { onMounted, reactive } from "vue"
import $api from '../axios'

export default {
    setup() {

        const roomData = reactive([])
        onMounted(async () => {

            const userId = localStorage.getItem('id')

            const res = await $api.get(`/chat/getByUser/${userId}`)

            roomData.push(...res.data)
        })


        return {
            roomData,
        }
    }
}
</script>

<style>

</style>