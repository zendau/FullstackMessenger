<template>
  <div>
      <ul>
          <li v-for="user in users" :key=user.userId>
              <p>{{user.userId}}</p>
              <p>{{user.userLogin}}</p>
              <button class="btn btn-primary" @click="sendInvinteToRoom(user.userId, roomId)">invite</button>
          </li>
      </ul>
  </div>
</template>

<script>
import { inject, onMounted, onUnmounted } from '@vue/runtime-core'
import { ref } from "vue";
export default {
    props: ['roomId', 'users'],
    setup() {
        console.log('setup free users')

        //const mountedStatus = inject('freeUserStatus')

        onMounted(() => console.log('mounted free users'))

        onUnmounted(() => socket.removeAllListeners('getFreeUsers'))

        const freeUsers = ref(null)

        const socket = inject('peerSocket')
        console.log(socket)

        //Object.keys(socket._callbacks).forEach(item => console.log(item + ' ' + socket[item]))
        socket.on('getFreeUsers', (users) => {
           console.log('free users', users)
           freeUsers.value = users
        })
        //console.log('=======================')
        //Object.keys(socket._callbacks).forEach(item => console.log(item + ' ' + socket[item]))
        

        // defineProps({
        //     roomId: String
        // })

        function sendInvinteToRoom(userId, roomId) {
            console.log(userId, roomId)
            socket.emit('invite-user', {
                userId, roomId
            })
        }


        return {
            freeUsers,
            sendInvinteToRoom
        }
    }
}
</script>

<style scoped>
    div {
        border: 1px solid black;
        padding: 10px;
        position: absolute;
        right: 100px;
    }
</style>