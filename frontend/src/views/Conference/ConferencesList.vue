<template>
  <SearchInput @search-pattern="searchChats" />
  <section class="rooms__container">
    <ul
      v-if="chatsList?.size > 0"
      class="rooms__list"
    >
      <li
        v-for="(room, index) in chatsList"
        :key="room.id"
        :ref="(el) => setLastRoomElement(el, index)"
        class="rooms__item"
      >
        <h3 class="room__title">
          {{ room[1].title }}
        </h3>
        <p class="room__author">
          <span v-if="room[1].adminId">Group</span>
          <span v-else>Private</span>
        </p>
        <small
          v-if="room[1].conferenceWithVideo === 1"
          class="room__type"
        ><i class="bi bi-camera-video-fill" /> Video conference</small>
        <small
          v-else
          class="room__type"
        ><i class="bi bi-mic-fill" /> Audio conference</small>
        <router-link
          class="room__link"
          :to="`/conference/${room[1].conferenceWithVideo === 1 ? 'video' : 'audio'}/${room[1].id}`"
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
import { computed, ref } from "vue";
import { useStore } from "vuex";
import SearchInput from "@/components/chat/SearchCreateGroup/SearchInput.vue";

export default {
  components: { SearchInput },
  setup() {
    const store = useStore();

    const userId = computed(() => store.state.auth.user.id);

    const chatsList = computed(() => store.getters["chat/chatList"]);

    const searchPattern = ref(null);

    const chatObserver = new IntersectionObserver((entries) => {
      for (let entry of entries) {
        if (entry.isIntersecting) {
          store.dispatch("chat/getChats", {
            userId: userId.value,
          });
          break;
        }
      }
    });

    const searchChats = (pattern) => {
      searchPattern.value = pattern;

      if (searchPattern.value.length === 0) {
        store.commit("chat/clearChatsByPattern");
        return;
      }

      store.dispatch("chat/getChatsByPattern", {
        userId: userId.value,
        pattern,
      });
    };

    function setLastRoomElement(el, index) {
      if (searchPattern.value || !el) return;
      if (chatsList.value.size - 1 !== index) return;

      chatObserver.disconnect();
      chatObserver.observe(el);
    }

    store.dispatch("chat/getChats", {
      userId: userId.value,
    });

    return {
      setLastRoomElement,
      searchChats,
      chatsList,
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
