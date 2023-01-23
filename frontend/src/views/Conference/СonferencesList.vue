<template>
  <section class="rooms__container">
    <ul
      v-if="rooms?.length > 0"
      class="rooms__list"
    >
      <li
        v-for="room in rooms"
        :key="room.id"
        class="rooms__item"
      >
        <h3 class="room__title">
          {{ room.roomTitle }}
        </h3>
        <p class="room__author">
          {{ room.adminLogin }}
        </p>
        <small
          v-if="room.roomWithVideo"
          class="room__type"
        ><i class="bi bi-camera-video-fill" /> Video conference</small>
        <small
          v-else
          class="room__type"
        ><i class="bi bi-mic-fill" /> Audio conference</small>
        <router-link
          class="room__link"
          :to="`/conference/${room.roomWithVideo ? 'video' : 'audio'}/${room.id}`"
        >
          Enter
        </router-link>
      </li>
    </ul>
    <p
      v-else
      class="rooms__message"
    >
      No conferences created
    </p>
  </section>
</template>

<script>
import { computed, inject, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const rooms = computed(() => store.state.conference.rooms);
    const socket = inject("socket");

    onMounted(() => {
      store.dispatch("conference/getConferesRooms");
    });

    onUnmounted(() => {
      socket.removeAllListeners("updateListOfRooms");
    });

    socket.on("updateListOfRooms", (newRoom) => {
      store.commit("conference/insertNewConferenceRoom", newRoom);
    });

    return {
      rooms,
    };
  },
};
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
    margin: 35px 0;
  }

  &__item {
    padding: 5px;
    border-radius: 3%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--messageColor);
  }

  &__message {
    color: var(--textColor);
    min-height: 100%;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
}

.room {
  &__title {
    margin: 10px 0;
    color: var(--textColor);
  }

  &__author {
    color: var(--secondTextColor);
  }

  &__type {
    color: var(--activeColor);
  }

  &__link {
    margin: 10px 0;
    text-decoration: none;
    width: 100px;
    height: 30px;
    display: block;
    text-align: center;
    background-color: var(--btnChat);
    line-height: 30px;
    border: 10%;
    transition: 0.3s ease;
    color: var(--textColor);

    &:hover {
      background-color: var(--btnHover);
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
