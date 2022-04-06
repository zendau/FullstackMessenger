<template>
  <div class="box">
      <h1>Group users</h1>
      <ul>
          <li v-for="user in groupUsers" :key=user.id>
              <p>{{user.id}}</p>
              <p>{{user.login}}</p>
          </li>
      </ul>
  </div>
</template>

<script>
//import { ref } from "vue";
import $api from '../axios';

// import { useRouter } from 'vue-router'

import { inject, onActivated, onMounted } from 'vue'

export default {
    setup() {    

        const groupUsers = inject('groupUsers')

        const roomId = inject('roomId')

        onMounted(async() => {
            const res = await $api.get(`/chat/groupUser/${roomId}`)
            groupUsers.push(...res.data)
        })

        onActivated(() => console.log(groupUsers))


        return {
            groupUsers
        }
    }
}
</script>

<style scoped>
    .box {
        min-height: 10px;
        min-width: 10px;
        border: 1px solid red;
        padding: 10px;
        position: absolute;
        right: 300px;
    }
</style>