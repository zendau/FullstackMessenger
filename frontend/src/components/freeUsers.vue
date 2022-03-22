<template>
  <div>
      <ul>
          <li v-for="user in freeUsers" :key=user.userId>
              <p>{{user.userId}}</p>
              <p>{{user.userLogin}}</p>
          </li>
      </ul>
  </div>
</template>

<script>
import { inject } from '@vue/runtime-core'
import { ref } from "vue";
export default {
    setup() {
        console.log('free')

        const freeUsers = ref(null)

        const socket = inject('socket')
        console.log(socket)

        socket.on('getFreeUsers', (users) => {
           freeUsers.value = users
        })


        return {
            freeUsers,
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