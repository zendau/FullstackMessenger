<template>
  <navbar />
  <slot />
</template>

<script>

import { provide, ref } from "vue";
import { useStore } from "vuex";
import navbar from "../components/layout/navbar.vue";
import { io } from "socket.io-client"

export default {
  components: { navbar },
  setup() {
    const store = useStore()

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
  }
}


</script>

<style lang="scss" scoped>
header {
  height: 50px !important;
}
</style>