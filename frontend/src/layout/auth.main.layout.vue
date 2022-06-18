<template>
  <navbar />
  <slot />
</template>

<script>

import { provide, ref } from "vue";
import { useStore } from "vuex";
import navbar from "../components/navbar/navbar.vue";
import { io } from "socket.io-client"
import { useRouter } from "vue-router";

export default {
  components: { navbar },
  setup() {
    const store = useStore()
    const router = useRouter()

    console.log('auth main layout')

    const socket = io('http://localhost:81');
    provide('socket', socket)

    const isConferenceAdmin = ref(false)
    provide('isConferenceAdmin', isConferenceAdmin)

    const peerSocketConnected = ref(false)
    provide('peerSocketConnected', peerSocketConnected)
    socket.on('connect', () => {
      console.log('connected gateway')
      peerSocketConnected.value = true
      socket.emit('connect-user', {
        userLogin: store.state.auth.user.login,
        userId: socket.id
      })
    })

    socket.on('userInviteRoom', (userData) => {
      if (userData.userId === socket.id) {
        console.log('if')
        const type = userData.type ? 'video' : 'audio'
        console.log(`/conference/${type}/${userData.roomId}`)
        router.push(`/conference/${type}/${userData.roomId}`)
      }
      console.log('invite room', userData)
    })
  }
}


</script>