<template>
    <div class="chat__send">
        <input type="text" placeholder="Message" v-model.trim="userMessage">
        <button class="send__btn" @click="sendMessage"><span class="material-icons">send</span></button>
    </div>
</template>

<script>

import {ref} from "vue"

export default {
    props: ["userLogin", "roomId", "userId", "socket"],
    setup(props) {

        const userMessage = ref("")

        function sendMessage() {

            if (userMessage.value.length > 0) {
                props.socket.data.sendMessage([props.userLogin, userMessage.value, props.roomId, props.userId])
                userMessage.value = ""
            }
        }

        return {
            sendMessage,
            userMessage
        }
    }
}
</script>

<style>
    .send__btn {
        border: none;
        background-color: #125d98;
        color: #fff;
        cursor: pointer;
        line-height: 14px;
    }
</style>