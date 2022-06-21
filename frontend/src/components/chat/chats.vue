<template>
  <div class="chat__contacts" :class="{'chat__contacts--active': !isShowMobileMessages}">
    <ul class="contacts__list">
      <li class="contact__item" v-for="chat in chatsData" :key="chat.id">
        <router-link
          :to="`/chat/${chat.id}`"
        >
          <i class="bi bi-people" v-if="chat.adminId"></i>
          <i class="bi bi-person" v-else></i>
          {{ chat.groupName }}
        </router-link>
      </li>
    </ul>
  </div>
</template>


<script>
import { computed, inject } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    store.dispatch('chat/getChats')

    const isShowMobileMessages = inject('isShowMobileMessages')

    const chatsData = computed(() => store.state.chat.chats);

    return {
      isShowMobileMessages,
      chatsData,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__contacts {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
    box-sizing: border-box;
    background-color: $bgcColor;

    button {
      margin-bottom: 10px;
      width: 100px;
      align-self: center;
    }
  }
}

.contacts {
  &__list {
    overflow: auto;

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

.contact {
  &__item {
    display: flex;
    align-items: center;
    transition: 0.3s ease;
    cursor: pointer;
    color: $textColor;
    a {
      color: inherit;
      text-decoration: none;
      width: 100%;
      height: 100%;
      padding: 14.5px 0;
    }

    &:hover {
      background-color: $itemColor;
    }
    input {
      margin: 0 5px;
    }

    i {
      margin: 0 10px;
      font-size: 26px;
    }
  }
}

.router-link-active {
  background-color: #2b5278;
}
</style>