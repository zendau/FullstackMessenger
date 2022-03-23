<template>
  <div>
      <ul>
          <li v-for="user in freeUsers" :key=user.userId>
              <p>{{user.userId}}</p>
              <p>{{user.userLogin}}</p>
              <button class="btn btn-primary" @click="sendInvinteToRoom(user.userId, roomId)">invite</button>
          </li>
      </ul>
  </div>
</template>

<script>
import { inject, onMounted } from '@vue/runtime-core'
import { ref } from "vue";
export default {
    props: ['roomId'],
    setup(props) {
        console.log('free', props)
        onMounted(() => console.log('mounted'))
        const freeUsers = ref(null)

        const socket = inject('socket')
        console.log(socket)

        socket.on('getFreeUsers', (users) => {
           console.log('free users', users)
           freeUsers.value = users
        })

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