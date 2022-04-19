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

        

        const peerSocket = io('http://localhost:81');
        provide('peerSocket', peerSocket)
        
        const peerSocketConnected = ref(false)
        provide('peerSocketConnected', peerSocketConnected)
        peerSocket.on('connect', () => {
            console.log('connected gateway')
            peerSocketConnected.value = true
            peerSocket.emit('connect-user', {
                userLogin,
                userId: peerSocket.id
            })
        })

        //console.log('inject', inject('message', 'test'))
        if (route.fullPath === '/room') router.push('/room/all')
    }
}
</script>

<style>

</style>