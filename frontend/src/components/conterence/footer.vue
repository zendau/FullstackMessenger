<template>
  <footer>
    <div class="conference__menu">
      <div class="menu__setting">
        <button @click="isMuted = !isMuted"><i class="bi" :class="isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'"></i>{{isMuted ? 'Upmute' : 'Mute'}}</button>
      </div>
      <div class="menu__conference-data">
        <h3 class="menu__conference-title">{{conferenceTitle}}</h3>
        <p class="menu__conference-admin">{{conferenceAdmin}}</p>
      </div>
      <button class="menu__chat" @click="$emit('showChat')"><i class="bi bi-chat-dots"></i> Chat</button>
    </div>
  </footer>
</template>

<script>
import { inject } from 'vue'

  export default {
    props: ['conferenceTitle', 'conferenceAdmin'],
    setup() {
      
      const isMuted = inject('isMuted')


      return {
        isMuted
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

    &__setting button, &__chat {
        width: 50px;
        height: 50px;
        border: none;
        background-color: inherit;
        color: $textColor;
        cursor: pointer;
        transition: .3s ease;

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

    &__conference-title, &__conference-admin {
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