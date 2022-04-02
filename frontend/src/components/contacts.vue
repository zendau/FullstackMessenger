<template>
  <div class="box">
      <h3>Hello {{login}}</h3>
      clients - {{clients}}
      clientLength - {{clientLength}}
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="groupType">
            <label class="form-check-label" for="flexSwitchCheckDefault">Group type</label>
        </div>
        <button v-if="groupType" class="btn btn-primary" :disabled="clientLength" @click="createGroupChat">Create group</button>
      <ul>
          <li v-for="user in contacts" :key=user.id>
              <p>{{user.id}}</p>
              <p>{{user.login}}</p>
              <div class="form-check" v-if="groupType">
                <input class="form-check-input" type="checkbox" :value="user.id" id="flexCheckDefault" v-model="clients">
                <label class="form-check-label" for="flexCheckDefault">
                    Add to group
                </label>
            </div>
            <button v-else @click="openUserChat(user.id)" class="btn btn-primary">Enter to chat</button>
          </li>
      </ul>
  </div>
</template>

<script>
//import { ref } from "vue";
import $api from '../axios';

import { useRouter } from 'vue-router'

import { computed, ref } from 'vue'

export default {
    async setup() {

        const router = useRouter()
        
        const res = await $api.get('/chat/getContacts')

        const login = localStorage.getItem('login')

        const contacts = res.data.filter((user) => user.login !== login)

        const groupType = ref(false)
        const clients = ref([])

        const userId = localStorage.getItem('id')

        async function openUserChat(id) {


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

        const clientLength = computed(() => clients.value.length < 2)

        function createGroupChat() {
            console.log('groupChat', [userId, ...clients.value])
        }

        return {
            login,
            contacts,
            openUserChat,
            groupType,
            clients,
            clientLength,
            createGroupChat,
            userId
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