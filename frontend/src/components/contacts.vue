<template>
  <div>
      <h3>Hello {{login}}</h3>
      <ul>
          <li v-for="user in contacts" :key=user.id @click="openUserChat(user.id)">
              <p>{{user.id}}</p>
              <p>{{user.login}}</p>
          </li>
      </ul>
  </div>
</template>

<script>
//import { ref } from "vue";
import $api from '../axios';
export default {
    async setup() {


        
        const res = await $api.get('/chat/getContacts')

        const login = localStorage.getItem('login')

        const contacts = res.data.filter((user) => user.login !== login)

        function openUserChat(id) {

            const userId = localStorage.getItem('id')

            console.log('test', id, userId)
        }

        return {
            login,
            contacts,
            openUserChat
        }
    }
}
</script>

<style scoped>
    div {
        min-height: 10px;
        min-width: 10px;
        border: 1px solid red;
        padding: 10px;
        position: absolute;
        right: 300px;
    }
</style>