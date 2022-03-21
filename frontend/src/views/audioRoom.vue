<template>
  
  <div>Room title - {{roomData.roomTitle}}</div>
  <div>Room author - {{roomData.adminLogin}}</div>
  <div>Room id - {{roomData.roomId}}</div>
  <ul>
      <li v-for="user in roomUsers" :key="user.userId">User - {{user.userId}}</li>
  </ul>

</template>

<script>
import { useRoute } from 'vue-router'
import {  reactive, onUnmounted, ref } from 'vue'

import {io} from "socket.io-client"

import $api from '../axios'

export default {
    async setup() {

        //const router = useRouter()
        const route = useRoute()

        const socket = io('http://localhost:3000');


 

        const roomId = route.params.id
        const userLogin = Date.now()
        const userId = socket.id

        const roomUsers = ref([])

        onUnmounted(() => {
            socket.emit('exit-room', {
                userId,
                roomId,
                userLogin
            });
        })


        const res = await $api.get('/room/get/'+roomId)
        const roomData = reactive(res.data)
        
        console.log(roomData, socket)
        socket.emit('join-room', { 
            userId,
            roomId: roomData.roomId,
            userLogin
        });

        // socket.on('join-room', () => {
        //     console.log('Connected');

        //     //
        // });

        socket.on('getUsers', (users) => {
            console.log('users', users);
            roomUsers.value = users
            //socket.emit('message', { test: 'test' });
        });


        return {
            roomData,
            roomUsers
        }
    }
}
</script>

<style>

</style>