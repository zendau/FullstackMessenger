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

    <button @click="$router.back()">back</button>

    <div v-if="isGroup">
        <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="invateStatus">
                <label class="form-check-label" for="flexSwitchCheckDefault">Invate</label>
        </div>
        <button @click="exitGroup">Exit group</button>
        <keep-alive>
            <invaited-users v-if="invateStatus"/>
            <group-users v-else/>
        </keep-alive>
    </div>
  

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

        const userId = localStorage.getItem('id')

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

        const chatId = ref(null)

        const isGroup = ref(null)

        onMounted(async () => {
            const res =  await $api.get(`/chat/checkId/${roomId}`)
            chatId.value = res.data.res.id
            if (!res.data.status) {
                router.push('/chat/all')
            }
            if (res.data.res.groupName === null) {
                isGroup.value = false
            } else {
                isGroup.value = true
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

        async function exitGroup() {
            console.log('exit user with id ',userId)
            const res = await $api.delete('/chat/exitUser', {
               params: {
                chatId: chatId.value,
                userId,
               }
            })

            if (res.data) {
                router.push('/chat/all')
            }
        }

        return {
            roomId,
            messages,
            message,
            sendMessage,
            invateStatus,
            exitGroup,
            isGroup
        }
    }
}
</script>

<style>

</style>