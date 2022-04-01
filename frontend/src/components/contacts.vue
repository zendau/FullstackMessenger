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

import { useRouter } from 'vue-router'

export default {
    async setup() {

        const router = useRouter()
        
        const res = await $api.get('/chat/getContacts')

        const login = localStorage.getItem('login')

        const contacts = res.data.filter((user) => user.login !== login)

        async function openUserChat(id) {

            const userId = localStorage.getItem('id')

            console.log('test', id, userId)

            const res = await $api.post('/chat/check', {
                
                    userId,
                    companionId: id
                
            })

            if (res.data.status) {
                router.push(`/chat/${res.data.chatId}`)
            } else {
                console.log('create')
                const chatData = await $api.post('/chat/create', {
                    userId,
                    companionId: id
                })

                const chatId = chatData.data[0].chat.chatId

                router.push(`/chat/${chatId}`)
            }
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