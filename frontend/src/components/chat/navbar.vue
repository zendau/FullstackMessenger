<template>
  <header>
    <nav class="chat__menu">
      <ul class="chat__list">
        <li @click="showContacts = true; isShowMobileMessages = false">
          <a class="chat__list-item" :class="{ 'chat__list-item--active': showContacts }">
            <i class="bi bi-chat-dots"></i>
            <span>Chats</span>
          </a>
        </li>
        <li @click="showContacts = false; isShowMobileMessages = false">
          <a class="chat__list-item" :class="{ 'chat__list-item--active': !showContacts }">
            <i class="bi bi-person-lines-fill"></i>
            <span>Contacts</span>
          </a>
        </li>
        <li>
          <router-link class="chat__list-item" to="/conferences">
            <i class="bi bi-broadcast"></i>
            <span>Calls</span>
          </router-link>
        </li>
        <li>
          <router-link class="chat__list-item" to="/user">
            <i class="bi bi-person-circle"></i>
            <span>User</span>
          </router-link>
        </li>
      </ul>
      <a class="chat__list-item chat__list-item--exit" href="#" @click="logout">
        <i class="bi bi-box-arrow-right"></i>
        <span>Exit</span>
      </a>
    </nav>
  </header>
</template>

<script>
import { inject } from '@vue/runtime-core'

import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const route = useRoute()
    const store = useStore()

    const isShowMobileMessages = inject('isShowMobileMessages')

    const showContacts = inject('showContacts')

    route.query.page = 'chat'
    console.log('NAVBAR', route)

    function logout() {
      store.dispatch('auth/logout')
    }

    return {
      isShowMobileMessages,
      showContacts,
      logout,
    }
  }
}
</script>

<style lang="scss" scoped>
.chat {
  &__menu {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    background-color: var(--menuColor);
  }

  &__list {
    width: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      align-items: center;
      width: 100%;
      padding: 5px 0;
      box-sizing: border-box;
      cursor: pointer;

      i,
      span {
        color: var(--textColor);
      }

      &--exit span {
        letter-spacing: 1px;
      }

      &--active {
        background-color: var(--activeBgcColor);

        i,
        span {
          color: var(--activeColor);
        }
      }

      i {
        font-size: 26px;
      }
    }
  }
}
</style>