<template>
    <div class="chat__header">
        <button @click="sideMenuShow"><span class="material-icons">reorder</span></button>
        <button @click="exitEvent"><span class="material-icons">logout</span></button>
        <h2>Room id - {{roomId}}</h2>
    </div>
</template>

<script>

import {useStore} from "vuex"
import {useRouter} from "vue-router"

export default {
    props: ['socket', 'roomId', 'stream'],
    emit: ["menu"],
    setup(props, ctx) {

        const store = useStore()

        const router = useRouter()

        function sideMenuShow() {
            ctx.emit("menu")
        }

        function exitEvent() {
            props.socket.data.logoutUser()
            router.push("/")
            store.state.userLogin = null
            store.state.userId = null
            store.state.roomId = null
            store.state.messages = []
            store.state.users = []

            props.stream.getTracks().forEach(function (track) {
         track.stop();
      });
            
        }

        return {
            exitEvent,
            sideMenuShow
        }
    }
}
</script>

<style lang="scss">
    .chat {
        &__header {
            display: flex;
            align-items: center;
            background-color: #ffeedb;
            min-height: 10%;
            width: 100%;
            box-shadow: 0px 5px 10px 0px rgba(34, 60, 80, 0.06);

            button {
                border: none;
                background-color: inherit;
                cursor: pointer;
                min-width: 35px;
                min-height: 35px;
                max-height: 35px;
                padding: 0;
                margin-right: 20px;
                span {
                    font-size: 35px;
                }
            }

            h2 {
                margin: 0;
                font-family: 'Roboto', sans-serif;
                margin-left: 25px;
            }
        }
    }
</style>
