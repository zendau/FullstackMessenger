<template>
  <section class="rooms__container">
    <ul class="rooms__list">
      <li class="rooms__item" v-for="room in rooms" :key="room.id">
        <h3 class="room__title">{{room.roomTitle}}</h3>
        <p class="room__author">{{room.adminLogin}}</p>
        <small class="room__type" v-if='room.roomWithVideo'><i class="bi bi-camera-video-fill"></i> Video conference</small>
        <small class="room__type" v-else><i class="bi bi-mic-fill"></i> Audio conference</small>
        <a class="room__link" href="audioConf.html">Enter</a>
      </li>
    </ul>
  </section>
</template>

<script>
import $api from '../axios'
import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup() {

    const router = useRouter()

    const socket = inject('socket', undefined)
    console.log('SOCKET', socket)
    const rooms = ref(null)

    socket.on('userInviteRoom', (userData) => {
      if (userData.userId === socket.id) {
        console.log('if')
        router.push(`/room/${userData.roomId}`)
      }
      console.log('invite room', userData)
    })

    onMounted(async () => {
      const res = await $api.get('/room/getAll')
      rooms.value = res.data
    })




    return {
      rooms,
    }
  }
}
</script>


<style lang="scss" scoped>
.rooms {
  &__container {
    width: 1200px;
    margin: 0 auto;
  }

  &__list {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, 250px);
    gap: 15px;
    justify-content: center;
    margin-top: 35px;
  }

  &__item {
    padding: 5px;
    border-radius: 3%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: $messageColor;
  }
}

.room {
  &__title {
    margin: 10px 0;
    color: $textColor;
  }

  &__author {
    color: $secondTextColor;
  }

  &__type {
    color: $activeColor;
  }

  &__link {
    margin: 10px 0;
    text-decoration: none;
    width: 100px;
    height: 30px;
    display: block;
    text-align: center;
    background-color: $btnChat;
    line-height: 30px;
    border: 10%;
    transition: .3s ease;
    color: $textColor;

    &:hover {
      background-color: $btnHover;
    }
  }
}

@media (max-width: 1140px) {

  .rooms {
    &__container {
      width: 1000px;
    }
  }
}


@media (max-width: 960px) {
  .rooms {
    &__container {
      width: 800px;
    }

    &__list {
      grid-template-columns: repeat(auto-fill, 200px);
    }
  }
}

@media (max-width: 730px) {
  .rooms {

    &__container {
      width: 100%;
    }

    &__list {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__item {
      width: 300px;
    }
  }

}
</style>