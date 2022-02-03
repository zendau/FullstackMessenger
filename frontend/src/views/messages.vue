<template>
    <ul class="messages" ref="messagesRef">
        <li v-for="(item, index) in messages" :key="index" class="message">
            <div v-if="item['id'] !== undefined" class="message__container"  :class="item['id'] === userId ? 'message--active' : ''">
                <p 
                class="login" 
                >{{item["login"]}}
                </p>
                <div class="body__message">
                <p class="message__content">{{item["message"]}}</p>
                <p class="time"><small>{{item['time']}}</small></p>
                </div>
            </div>
            <div class="message--enter" v-else>
                <p class="user__enter">{{item["message"]}}</p>
            </div>
        </li>
    </ul>
</template>

<script>

import {reactive, ref} from "vue"
import {useStore} from "vuex"

export default {
    props: ["userId"],
    emit: ["msgRef"],

    setup(props, ctx) {

        const messagesRef = ref(null)
        
        ctx.emit("msgRef", messagesRef)

        const store = useStore()

        const messages = reactive(store.state.messages)


        return {
            messages,
            messagesRef
        }
    }

}
</script>

<style lang="scss" scoped>
    .messages {
        width: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
        max-height: 600px;
        overflow-y: auto;
        list-style: none;
        padding: 0;
        min-height: 100%;
        padding-top: 15px;
        box-sizing: border-box;

    }
    .message {
        margin: 15px;
        margin-top: 0;
        font-size: 18px;
        border-radius: 5px;

        &__container {
            display: flex;
            flex-direction: column;
            background-color: rgb(201, 201, 201);
            margin-left: auto;
            width: 600px;
            border-radius: 5px;
            padding: 5px;
        }

        &__content {
            word-break: break-all;
        }

        &--enter {
            margin: 0 auto
        }

        &--active {
            background-color: burlywood;
            margin-right: auto;
            margin-left: 0;
        }
    }

    .body__message {
        display: flex;
        width: 100%;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 5px;
        p {
            margin: 0;
        }
    }

    .login {
        margin: 5px;
        margin-right: 15px;
        color: #343a40;
    }

    .user__enter {
        text-align: center;
        margin: 0px;
    }

    .time {
        margin-left: 10px;
    }
</style>