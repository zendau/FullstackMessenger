<template>
  <ul v-if="freeUsers?.length > 0">
    <li
      v-for="user in freeUsers"
      :key="user.userId"
      @click="sendInvinteToRoom(user.userId)"
    >
      {{ user.userLogin }}
    </li>
  </ul>
  <ul v-else>
    <p>No users</p>
  </ul>
</template>

<script>
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    
    const route = useRoute()

    const withVideo = route.name === "videoRoom"

    const freeUsers = ref(null)
    const socket = inject('socket')


    const roomId = route.params.id

    socket.on('getFreeUsers', (users) => {
      console.log('room tpye', withVideo)
      console.log("free users 1", users)
      freeUsers.value = users
    })


    function sendInvinteToRoom(userId) {
      console.log(userId, roomId)
      socket.emit('invite-user', {
        userId, roomId, type: withVideo,
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
ul {
  list-style: none;
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  background-color: #17212b;
  border-top: 1px solid black;
}

li {
  padding: 10px;
  text-align: center;
  color: rgba(255, 255, 255, 0.84);
  cursor: pointer;
}

p {
  padding: 10px;
  text-align: center;
  color: rgba(255, 255, 255, 0.84);
}
</style>