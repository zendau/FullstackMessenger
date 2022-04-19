<template>
  <slot/>
</template>

<script>

import {io} from "socket.io-client"
import { provide, ref } from 'vue'

export default {
  setup() {
    const chatSocket = io('http://localhost:80');
        provide('chatSocket', chatSocket)
        const userLogin = Date.now()
        
        const chatSocketConnected = ref(false)
        provide('chatSocketConnected', chatSocketConnected)
        chatSocket.on('connect', () => {
            console.log('connected gateway')
            chatSocketConnected.value = true
            chatSocket.emit('connect-user', {
                userLogin,
                userId: chatSocket.id
            })
        })
  }
}
</script>

<style>

</style>