<template>
  
  <div>Room title - {{roomData.roomTitle}}</div>
  <div>Room author - {{roomData.adminLogin}}</div>
  <div>Room id - {{roomData.roomId}}</div>
  <ul>
      <li v-for="user in roomUsers" :key="user.userId">User - {{user.userId}}. Mute status - {{!!user.mute}}</li>
  </ul>
  <free-users :roomId='roomId' />
</template>

<script>
import { useRoute } from 'vue-router'
import {  reactive, onUnmounted, ref, inject, watch } from 'vue'


import $api from '../axios'
import freeUsers from '../components/freeUsers.vue'
export default {
    components: { freeUsers },
    async setup() {
        
        //const router = useRouter()
        const route = useRoute()

        const roomUsers = ref([])

        // user Data
        const roomId = route.params.id
        const userLogin = Date.now()
        const userId = ref(null)

        const socket = inject('socket', undefined)
        const socketConnected = inject('connected', false)
       
        watch(socketConnected, (status) => {
            if (status) {
                userId.value = socket.id
                console.log('join to the room')
                socket.emit('join-room', { 
                    userId: userId.value,
                    roomId: roomId,
                    userLogin
                })
            }
        }, {
            immediate: true
        })

        // socket.on('connect', () =>{
        //     console.log('connected room')
        //     userId.value = socket.id

        //     socket.emit('join-room', { 
        //         userId: userId.value,
        //         roomId: roomData.roomId,
        //         userLogin
        //     })

        //     console.log( userId.value, roomData.roomId, userLogin)
        //     //Object.keys(socket).forEach(item => console.log(item + ' ' + socket[item]))
        // })


       
        onUnmounted(() => {
            socket.emit('exit-room', {
                userId: userId.value,
                roomId: roomId,
                userLogin
            })
            window.removeEventListener('keypress', muteEvent)
        })




        socket.on('getUsers', (users) => {
            console.log('users', users);
            roomUsers.value = users
            //socket.emit('message', { test: 'test' });
        });



        const res = await $api.get('/room/get/'+roomId)
        const roomData = reactive(res.data)
        

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

        // Object.keys(socket).forEach(item => console.log(item, socket[item]))

      
        // Object.keys(socket).forEach(item => console.log(item, socket[item]))

        window.addEventListener('keypress', muteEvent)

        function muteEvent(event) {
          if (event.code === 'KeyM') {
            console.log('click M', userId.value)
            socket.emit('userMute', {
                userId: userId.value,
                roomId
            })
          }
        }

        return {
            roomData,
            roomUsers,
            roomId
        }
    }
}
</script>

<style>

</style>