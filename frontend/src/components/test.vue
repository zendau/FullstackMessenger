<template>
  <h1>Test</h1>
  <button @click="btnSend">Send</button>
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

      

        

        const socket = io('http://localhost:3000');

        socket.on('connect', function() {
            console.log('Connected');

            socket.emit('message', { test: 'test' });
        });

        socket.on('answer', function(data) {
            console.log('event', data);
        });

        function btnSend() {
            socket.emit('message', { test: 'test' });
        }

      return {
            btnSend,
            message
        }
    }

}
</script>

<style>

</style>