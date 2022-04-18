<template>
<router-view></router-view>
</template>

<script>

import { useRouter, useRoute } from 'vue-router'
import { provide, ref } from 'vue'


import {io} from "socket.io-client"

export default {
    setup() {
        const userLogin = Date.now()


        const router = useRouter()
        const route = useRoute()

        const socket = io('http://localhost:81');
        provide('socket', socket)
        
        const socketConnected = ref(false)
        provide('connected', socketConnected)
        socket.on('connect', () => {
            console.log('connected gateway')
            socketConnected.value = true
            socket.emit('connect-user', {
                userLogin,
                userId: socket.id
            })
        })

        //console.log('inject', inject('message', 'test'))
        if (route.fullPath === '/room') router.push('/room/all')
    }
}
</script>

<style>

</style>