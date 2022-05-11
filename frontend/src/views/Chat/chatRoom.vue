<template>
  test chat room
  <!-- <chats/>
  <contacts/>
  <users-online/> -->
</template>

<script>

// import usersOnline from '../../components/usersOnline.vue'
// import Contacts from '../../components/contacts.vue'
// import { inject } from 'vue'
// import Chats from '../../components/chats.vue'

export default {
  //components: { usersOnline, Contacts, Chats },

  setup() {

    // const userLogin = Date.now()

    // const socket = inject('socket', undefined)
    
    // // socket.on('test', () => {
    // //   console.log('connected gateway')
    // //   socket.emit('connect-user', {
    // //       userLogin,
    // //       userId: socket.id
    // //   })
    // // })

  }


}
</script>

<style scoped>

  ul {
    list-style: none;
  }

  li {
    border: 1px solid black;
    margin: 10px;
    width: 100px;
  }
</style>