<template>
    <template v-if="routeName === 'chat'">
      <slot/>
    </template>
    <template v-else>
      <navbar/>
      <slot/>
    </template>
    
</template>

<script>

//import {io} from "socket.io-client"
import { computed } from 'vue'

import { useRoute } from 'vue-router'

import Navbar from '../components/layout/navbar.vue'

export default {
  components: {Navbar},
  setup() {
    // const chatSocket = io('http://localhost:80');
    //     provide('chatSocket', chatSocket)
    //     const userLogin = Date.now()
        
    //     const chatSocketConnected = ref(false)
    //     provide('chatSocketConnected', chatSocketConnected)
    //     chatSocket.on('connect', () => { 
    //         console.log('connected gateway')
    //         chatSocketConnected.value = true
    //         chatSocket.emit('connect-user', {
    //             userLogin,
    //             userId: chatSocket.id
    //         })
    //     })
    const route = useRoute()
    console.log("ROUTE", route)

    const routeName = computed(() => route.name) 

    return {
      routeName
    }
  }
}
</script>


<style lang="scss" scoped>
// header {
//   height: 50px!important;
// }

// body {
//     background-color: $menuColor;
// }

// .user {
//     &__container {
//         width: 600px;
//         background-color: $bgcColor;
//         margin: 50px auto;
//         display: flex;
//         flex-direction: column;
//         color: $textColor;
//         border-radius: 3px;
//         padding: 15px 0;
//     }

//     &__title {
//         text-align: center;
//         margin: 25px 0;
//         color: $textColor;
//     }

//     &__hr {
//         width: 80%;
//         margin: 35px auto;
//         border-color: $secondTextColor;
//     }

//     &__role {
//         text-align: center;
//     }

//     &__link {
//         align-self: center;
//         color: $linkColor;
//         text-decoration: none;
//         margin-bottom: 15px;
//     }

//     &__form {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         margin: 0 auto;
//         margin-top: 20px;

//         label {
//             margin-bottom: 5px;
//             color: $textColor;
//         }

//         input {
//             border: none;
//             outline: none;
//             color: $textColor;
//             padding: 5px;
//             font-size: 18px;
//             margin-bottom: 20px;

//             &::placeholder {
//                 color: $textColor;
//             }  
//         }

//         input[type='submit'] {
//             background-color: $btnChat;
//             transition: .3s ease;
//             cursor: pointer;

//             &:hover {
//                 background-color: $btnHover;
//             }
//         }

//         select, input {
//             width: 200px;
//             font-size: 16px;
//             background-color: #242f3d;
//         }

//         select {
//             margin: 15px 0;
           
//             border: none;
//             outline: none;
//             color: $textColor;
//             border-radius: 0;
//         }
//     }
// }

// @media (max-width: 720px) {

   
// .user {
//     &__container {
//         width: 90%;
//         margin: 15px auto;
//         box-sizing: border-box;
//     }
// }
   
// }
</style>