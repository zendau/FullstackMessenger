<template>
  <section class="main-container">
    <div class="conference-container">
      <router-view />
    </div>
    <div v-if="showChat" class="conference-chat">
      <conference-chat roomId="46549cab-90a2-4bfe-8840-1bbc5a015ca2" />
    </div>
  </section>
  <footer-component 
    @showChat="showChat = !showChat"
    :conferenceTitle="roomData?.roomTitle"
    :conferenceAdmin="roomData?.adminLogin"
  />
</template>

<script>
import footerComponent from '../components/conterence/footer.vue'
import conferenceChat from '../components/conterence/chat/chat.vue'
import { onMounted, provide, ref } from "vue";

import $api from '../axios';
import { useRoute } from 'vue-router';

export default {
  components: { footerComponent, conferenceChat },
  setup() {

    const showChat = ref(false)

    const roomData = ref(null)

    const route = useRoute()
    const roomId = route.params.id

    const isMuted = ref(false)
    provide('isMuted', isMuted)


    const isConferenceAdmin = ref(false)
    provide('isConferenceAdmin', isConferenceAdmin)


    onMounted(async () => {
      const res = await $api.get('/room/get/' + roomId)
      console.log('res', res)
      roomData.value = res.data
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
#app {
  display: grid;
  grid-template-rows: 50px 1fr 60px;
  height: 100vh;
  max-height: 100vh;

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
    overflow-y: scroll;
    padding: 5px 10px;
    align-content: baseline;

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
    justify-content: space-between;
    width: 350px;


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
</style>