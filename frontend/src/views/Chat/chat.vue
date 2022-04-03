<template>
  roomId - {{roomId}}
    
    <h1>Messages</h1>
    <div>
        <p v-for="message in messages" :key="message.id">
            {{message.userId}} - {{message.text}}
        </p>
    </div>
    <input type="text" placeholder="message" ref="message">
    <button @click="sendMessage">Send message</button>

     <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="invateStatus">
            <label class="form-check-label" for="flexSwitchCheckDefault">Invate</label>
    </div>
    
    <keep-alive>
        <invaited-users v-if="invateStatus"/>
        <group-users v-else/>
    </keep-alive>
    

</template>

<script>
import { reactive } from '@vue/reactivity'

import { ref } from 'vue'

import {useRoute, useRouter} from "vue-router"
import { inject, onMounted, provide } from '@vue/runtime-core'
import $api from '../../axios'
import groupUsers from '../../components/groupUsers.vue'
import InvaitedUsers from '../../components/invaitedUsers.vue'

export default {
  components: { groupUsers, InvaitedUsers },
    setup() {

        console.log('provide')
        const groupUsers = reactive([])
        provide('groupUsers', groupUsers)


        const route = useRoute()
        const router = useRouter()

        const userLogin = Date.now()

        const message = ref(null)

        const invateStatus = ref(false)

        const socket = inject('socket', undefined)

        const messages = reactive([
            {
                id: 1,
                userId: 1,
                text: 'hello',
                roomId: 1
            },
             {
                id: 2,
                userId: 2,
                text: 'test',
                roomId: 1
            }
        ])


        const roomId = route.params.id

        provide('roomId', roomId)

        onMounted(async () => {
            const res =  await $api.get(`/chat/checkId/${roomId}`)
            if (!res.data.status) {
                router.push('/chat/all')
            }
        })

        console.log('join to the room')
        socket.emit('join-room', { 
            userId: socket.id,
            roomId,
        })


        socket.on('newMessage', (messageData) => {
            console.log('NEEEEW')
            messages.push(messageData)
        })

        function sendMessage() {
            console.log(message)
            socket.emit('sendMessage', {
                userId: userLogin,
                text: message.value.value,
                roomId
            })

            message.value.value = ''
        }

        return {
            roomId,
            messages,
            message,
            sendMessage,
            invateStatus
        }
    }
}
</script>

<style>

</style>