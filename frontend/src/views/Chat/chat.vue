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

</template>

<script>
import { reactive } from '@vue/reactivity'

import { ref } from 'vue'

import {useRoute, useRouter} from "vue-router"
import { inject, onMounted } from '@vue/runtime-core'
import $api from '../../axios'

export default {
    setup() {

        const route = useRoute()
        const router = useRouter()

        const userLogin = Date.now()

        const message = ref(null)

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
            sendMessage
        }
    }
}
</script>

<style>

</style>