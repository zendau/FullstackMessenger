<template>
		<chatNavbar/>
		<section class="chat__container">
            <chats v-if="showContacts"/>
			<contacts v-else/>
			<messages/>
		</section>
    <!-- <div v-if="chatId">
        chat id - {{chatId}}
    </div>
    <div v-else>
        no selected chat
    </div> -->
    
</template>

<script>
import { computed, provide } from '@vue/runtime-core'

import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useStore } from "vuex";

import chatNavbar from '../../components/chat/navbar.vue'
import Contacts from '../../components/chat/contacts.vue'
import Messages from '../../components/chat/messages.vue'
import Chats from '../../components/chat/chats.vue'

import {io} from "socket.io-client"

export default {
	components: {chatNavbar, Contacts, Messages, Chats },
    setup() {
        const route = useRoute()
        const chatId = computed(() => route.params.id) 

        const showContacts = ref(true)

        const roomData = ref({
            title: 'Test',
            group: {
                count: 4,
                users: [1,2,3]
            }
        })

        provide('roomData', roomData)
        provide('showContacts', showContacts)

        const store = useStore()
        const userData = computed(() => store.getters["auth/getUserData"]);


        const socket = io('http://localhost:80');
        provide('socket', socket)
        
        const socketConnected = ref(false)
        provide('connected', socketConnected)
        socket.on('connect', () => {
            console.log('connected gateway')
            socketConnected.value = true
            socket.emit('connect-user', {
                userLogin: userData.email,
                userId: socket.id
            })
        })

        return {
            chatId,
            showContacts,
            Chats
        }
    },
}
</script>

<style lang="scss">
	#app {
    display: grid;
    grid-template-columns: 80px 1fr;
    height: 100vh;
    max-height: 100vh;
	}

	.chat__container {
		display: grid;
		grid-template-columns: 250px 1fr;
			
	}

	.btn {
    &--chat {
			background-color: $btnChat;
			border: none;
			color: $textColor;
			border-radius: 2px;
			padding: 5px 9px;
			cursor: pointer;
			transition: .3s ease;

			&:hover {
					background-color: $btnHover;
			}
    }
	}


@media (max-width: 720px) {
    .chat {

        &__container {
            grid-template-columns: 1fr;
        }

        &__contacts {
            display: none;

            &--active {
                display: block;
            }
        }
    }
    
}


</style>