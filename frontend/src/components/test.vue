<template>
  <h1>Test</h1>
  <input type="text" v-model.trim="userLogin">
  <button @click="btnSend">Send</button>
  <button @click="testRoom">Room</button>
  <br>
  {{message}}
</template>

<script>
import {io} from "socket.io-client"
import { onMounted, ref } from '@vue/runtime-core'

export default {

    setup() {
        onMounted(() => {
             console.log('mounted')
        })

        const message = ref('message')

        const roomId = ref('123')

        const userLogin = ref('')

      

        

        const socket = io('http://localhost:3000');

        socket.on('connect', function() {
            console.log('Connected');

            //socket.emit('message', { test: 'test' });
        });

        socket.on('answer', function(data) {
            console.log('event', data);
        });

        function btnSend() {
            socket.emit('message', { userLogin: userLogin.value, roomId: roomId.value });
        }

        function testRoom() {
            socket.emit('room', roomId.value);
        }

      return {
            btnSend,
            message,
            userLogin,
            testRoom
        }
    }

}
</script>

<style>

</style>