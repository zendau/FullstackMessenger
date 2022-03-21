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

        onUnmounted(() => {
            socket.emit('exit-room', {
                userId: userId.value,
                roomId: roomData.roomId,
                userLogin
            });
        })


        //const router = useRouter()
        const route = useRoute()

        const roomUsers = ref([])

        
        const socket = io('http://localhost:3000');
        socket.hello = 'world'

        const roomId = route.params.id
        const userLogin = Date.now()
        const userId = ref(null)

        const res = await $api.get('/room/get/'+roomId)
        const roomData = reactive(res.data)

        socket.on('connect', () => {
            userId.value = socket.id

            socket.emit('join-room', { 
                userId: userId.value,
                roomId: roomData.roomId,
                userLogin
            })

            console.log( userId.value, roomData.roomId, userLogin)
        });

        // socket.on('disconnect',function() {
        //     socket.emit('exit-room', {
        //         userId: userId.value,
        //         roomId,
        //         userLogin
        //     });
        // });

        

       

        
        //Object.keys(socket).forEach(item => console.log('!!! ', item, socket[item]))
        //console.log('id',)
        

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