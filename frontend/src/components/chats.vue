<template>
   <ul>
    <li v-for="room in roomData" :key="room.id">
      <router-link :to="'/chat/'+room.chatId">{{room.groupName}} <span v-if="room.groupType">[group]</span> </router-link>
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

            const userId = parseInt(localStorage.getItem('id'))

            const res = await $api.get(`/chat/getByUser/${userId}`)
            console.log('resSS', res)
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