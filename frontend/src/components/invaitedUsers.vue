<template>
  <div class="box">
      <h1>Ivaited users</h1>
      <ul>
            <button class="btn btn-primary" :disabled="clients.length < 1" @click="addToGroupChat">Add to group</button>
          <li v-for="user in invaitedUsers" :key=user.id>
              <p>{{user.id}}</p>
              <p>{{user.login}}</p>
              <input class="form-check-input" type="checkbox" :value="user.id" id="flexCheckDefault" v-model="clients">
                <label class="form-check-label" for="flexCheckDefault">
                    Add to group
                </label>
          </li>
      </ul>
  </div>
</template>

<script>
//import { reactive } from '@vue/reactivity';
import { ref, inject, onActivated} from "vue";
import $api from '../axios';

// import { useRouter } from 'vue-router'

// import { computed, ref } from 'vue'

export default {
    props: {
      roomId: String
    },
    async setup() {     
      
        const groupUsers = inject('groupUsers')
        
         const roomId = inject('roomId')

        const clients = ref([])

        const invaitedUsers = ref([])

        onActivated(async () => {

            const usersId = []
      
            groupUsers.forEach(element => {
                usersId.push(element.id)

                
            });

            const res = await $api.get('/chat/invaitedUsers/', {
                params: {
                        userData: usersId
                }
            })
            invaitedUsers.value.splice(0)
            invaitedUsers.value.push(...res.data)
        })

        
        function addToGroupChat() {

          invaitedUsers.value = invaitedUsers.value.filter(item => {
            if (clients.value.indexOf(item.id) === -1) {    
              return item
            } else {
              groupUsers.push(item)
            }
          })
          
          $api.patch('/chat/invaiteToChat', {
            usersId: clients.value,
            roomId
          })

          console.log(groupUsers)
          clients.value = []

        }

        return {
            invaitedUsers,
            clients,
            addToGroupChat
        }
    }
}
</script>

<style scoped>
    .box {
        min-height: 10px;
        min-width: 10px;
        border: 1px solid blue;
        padding: 10px;
        position: absolute;
        right: 300px;
    }
</style>