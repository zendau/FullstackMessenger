<template>
  <SearchInput @search-pattern="searchChats" />
  <section class="rooms__container">
    <ul
      v-if="chatsList?.size > 0"
      class="rooms__list"
    >
      <ConferenceItem
        v-for="(room, index) in chatsList"
        :key="room.id"
        :ref="(el) => setLastRoomElement(el, index)"
        :room-data="room[1]"
      />
    </ul>
    <p
      v-else
      class="rooms__message"
    >
      {{ $t("view.conferencesList.empty") }}
    </p>
  </section>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import SearchInput from "@/components/chat/SearchCreateGroup/SearchInput.vue";
import ConferenceItem from "@/components/conference/ConfrenceItem.vue";

export default {
  components: { SearchInput, ConferenceItem },
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

    function setLastRoomElement(component, index) {
      const el = component?.$el;

      if (!el) return;

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

<style scoped>
.search__container {
  width: 50%;
  margin: 10px auto;
}
</style>

<style lang="scss">
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
    margin: 20px 0;
  }

  &__item {
    padding: 5px;
    border-radius: 3%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-message);
  }

  &__message {
    color: var(--color-primary);
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
    color: var(--color-primary);
  }

  &__author {
    color: var(--color-secondary);
  }

  &__type {
    color: var(--color-links-active);
    margin-top: 5px;
    svg {
      margin-right: 5px;
    }
  }

  &__link {
    margin: 10px 0;
    text-decoration: none;
    display: block;
    text-align: center;
    background-color: var(--button-chat-color);
    line-height: 30px;
    border-radius: 4px;
    transition: 0.3s ease;
    color: var(--color-primary);
    padding: 5px 8px;

    &:hover {
      background-color: var(--button-chat-hover);
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
