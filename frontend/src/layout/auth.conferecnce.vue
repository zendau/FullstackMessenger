
<template>
  <section class="main-container">
    <div class="conference-container" :class="{ 'conference-container--audio': !roomData.type }">
      <router-view />
    </div>
    <div v-if="showChat" class="conference-chat">
      <conference-chat :roomId="roomData.chatId" />
    </div>
  </section>
  <footer-component @showChat="showChat = !showChat" :conferenceTitle="roomData.title"
    :conferenceAdmin="roomData.adminLogin" />
</template>

<script>
import footerComponent from '../components/conterence/footer.vue'
import conferenceChat from '../components/conterence/chat/chat.vue'
import { computed, inject, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  components: { footerComponent, conferenceChat },
  setup() {

    const showChat = ref(false)
    const store = useStore()

    const roomData = computed(() => store.state.conference)

    const route = useRoute()
    const router = useRouter()
    const roomId = route.params.id

    const isMuted = ref(false)
    provide('isMuted', isMuted)


    const isPauseVideo = ref(false)
    provide('isPauseVideo', isPauseVideo)


    const isConferenceAdmin = inject('isConferenceAdmin')
    const socket = inject('socket')

    onMounted(async () => {
      store.dispatch('conference/getConferenceData', roomId)
      document.querySelector("#app")
       document.querySelector("#app").classList.add('conference-grid')
    })

    onUnmounted(() => {
      isConferenceAdmin.value = false
      document.querySelector("#app").classList.remove('conference-grid')
    })


    watch(() => store.state.conference.adminId, adminId => {
      if (adminId === store.state.auth.user.id) {
        isConferenceAdmin.value = true
      }
      const userId = store.state.auth.user.id

      const chatId = store.state.conference.chatId

      if (chatId) {
        store.dispatch('chat/invaiteUserToChat', {
          userId,
          chatId
        })
      }

    }, {
      immediate: true
    })

    socket.on('redirectUsers', () => {
      store.dispatch('conference/getConferesRooms')
      router.push('/conferences')
    })

    return {
      showChat,
      roomData,
      isMuted
    }

  }
}
</script>

<style>
.conference-grid {
  display: grid;
  grid-template-rows: 50px 1fr 60px;
  height: 100vh;
  max-height: 100vh;
}

@media (max-width: 960px) {

  .conference-grid {
    grid-template-rows: 1fr 60px;
  }
}
</style>

<style lang="scss">
.main-container {
  overflow: hidden;
  display: flex;
  background-color: $menuColor;
}

.conference {

  &-container {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
    overflow-y: auto;
    justify-items: center;
    margin: 3px;

    &--audio {
      grid-template-rows: repeat(auto-fit, 50px);
      align-content: center;
      grid-template-columns: repeat(auto-fit, 300px);
      justify-content: center;
      grid-auto-flow: column;
    }


    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #3f4750;
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9b9fa4;
      box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
      border-radius: 10px;
    }

    &--hide {
      display: none;
    }
  }

  &-chat {
    display: flex;
    flex-direction: column;
    width: 350px;
    background-color: $messageColor;


    &--active {
      width: 100%;
      position: absolute;
      z-index: 2;
      background-color: white;
      height: 100%;
    }
  }

  &__menu {
    display: flex;
    height: 100%;
    width: 800px;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
  }

}

.chat {
  &__body {
    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #3f4750;
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9b9fa4;
      box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
      border-radius: 10px;
    }
  }
}


@media (max-width: 1140px) {}

@media (max-width: 960px) {

  header {
    z-index: 2;
    height: auto !important;
    width: 100%;
    position: absolute;
  }

  .main-container {
    max-height: 100vh;
    position: relative;
  }

  .conference {
    &__menu {
      width: 600px;
      margin: 0 auto;
    }
  }
}

@media (max-width: 730px) {

  .conference {

    &-container {
      display: block;
    }

    &__menu {
      width: 275px;
      margin: 0 auto;
    }
  }
}
</style>