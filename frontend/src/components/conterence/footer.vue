<template>
  <footer>
    <div class="conference__menu">
      <div class="menu__setting">
        <button @click="isMuted = !isMuted"><i class="bi" :class="isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'"></i>{{
            isMuted ? 'Unmute' : 'Mute'
        }}</button>
        <button v-if="type" @click="isPauseVideo = !isPauseVideo"><i class="bi"
            :class="isPauseVideo ? 'bi-camera-video-off-fill' : 'bi-camera-video-fill'"></i>{{ isPauseVideo ? 'Off' :
                'On'
            }}</button>
      </div>
      <div class="menu__conference-data">
        <h3 class="menu__conference-title">{{ conferenceTitle }}</h3>
        <p class="menu__conference-admin">{{ conferenceAdmin }}</p>
      </div>
      <button class="menu__chat" @click="$emit('showChat')"><i class="bi bi-chat-dots"></i> Chat</button>
    </div>
  </footer>
</template>

<script>
import { computed, inject } from 'vue'
import { useStore } from 'vuex'

export default {
  props: ['conferenceTitle', 'conferenceAdmin'],
  setup() {
    const store = useStore()
    const type = computed(() => store.state.conference.type)

    const isMuted = inject('isMuted')
    const isPauseVideo = inject('isPauseVideo')


    return {
      isMuted,
      isPauseVideo,
      type
    }

  }
}
</script>

<style lang="scss" scoped>
footer {
  height: 60px;
  background-color: $bgcColor;
  box-sizing: border-box;
}


.menu {

  &__setting button,
  &__chat {
    width: 50px;
    height: 50px;
    border: none;
    background-color: inherit;
    color: $textColor;
    cursor: pointer;
    transition: .3s ease;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:hover {
      color: $activeColor;
    }

    i {
      font-size: 24px;
    }

    font-size: 14px;
  }

  &__conference-title {
    color: $textColor;
  }

  &__conference-admin {
    color: $secondTextColor;
  }

  &__conference-title,
  &__conference-admin {
    text-align: center;

  }

  &__chat {
    width: 50px;
    height: 50px;

    i {
      font-size: 24px;
    }

    font-size: 14px;
  }
}
</style>