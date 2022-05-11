<template>
		<chatNavbar/>
		<section class="chat__container">
			<contacts/>
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
import { computed } from '@vue/runtime-core'

import { useRoute } from 'vue-router'

import chatNavbar from '../../components/chat/navbar.vue'
import Contacts from '../../components/chat/contacts.vue'
import Messages from '../../components/chat/messages.vue'

export default {
	components: {chatNavbar, Contacts, Messages},
    setup() {
        const route = useRoute()
        const chatId = computed(() => route.params.id) 


        return {
            chatId
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