<template>
  test chat room
  <ul>
    <li v-for="room in tempRoomData" :key="room.roomId">
      <router-link :to="'/chat/'+room.roomId">Enter to room</router-link>
      {{room.roomId}}
    </li>
  </ul>
  <contacts/>
  <users-online/>
</template>

<script>

import usersOnline from '../../components/usersOnline.vue'
import Contacts from '../../components/contacts.vue'
import { inject } from 'vue'

export default {
  components: { usersOnline, Contacts },

  setup() {

    const tempRoomData = [
      {
        roomId: 1,
      },
      {
        roomId: 2,
      }
    ]


    const userLogin = Date.now()


    const socket = inject('socket', undefined)
    
    socket.on('test', () => {
      console.log('connected gateway')
      socket.emit('connect-user', {
          userLogin,
          userId: socket.id
      })
    })


    return {
      tempRoomData,
    }

  }


}
</script>

<style>

  ul {
    list-style: none;
  }

  li {
    border: 1px solid black;
    margin: 10px;
    width: 100px;
    cursor: pointer;
  }
</style>