<template>
  <header>
    <nav class="chat__menu">
      <ul class="chat__list">
        <li @click="showContacts = true">
          <a class="chat__list-item" :class="{ 'chat__list-item--active': showContacts}" href="#">
            <i class="bi bi-chat-dots"></i>
            <span>Chats</span>
          </a>
        </li>
        <li @click="showContacts = false">
          <a class="chat__list-item" :class="{ 'chat__list-item--active': !showContacts}" href="#">
            <i class="bi bi-person-lines-fill"></i>
            <span>Contacts</span>
          </a>
        </li>
        <li>
          <a class="chat__list-item" href="rooms.html">
            <i class="bi bi-broadcast"></i>
            <span>Calls</span>
          </a>
        </li>
        <li>
          <a class="chat__list-item" href="user.html">
            <i class="bi bi-person-circle"></i>
            <span>User</span>
          </a>
        </li>
      </ul>
      <a class="chat__list-item chat__list-item--exit" href="#">
        <i class="bi bi-box-arrow-right"></i>
        <span>Exit</span>
      </a>
    </nav>
    </header>
</template>

<script>
import { inject } from '@vue/runtime-core'

import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()

    const showContacts = inject('showContacts')

    route.query.page = 'chat'
    console.log('NAVBAR',route)

    return {
      showContacts
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
      background-color: $menuColor;
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

        i, span {
          color: $textColor;
        }

        &--exit span {
          letter-spacing: 1px;
        }

        &--active {
          background-color: $activeBgcColor;

          i, span {
            color: $activeColor;
          }
        }
        i {
          font-size: 26px;
        }
      }
    }
  }

</style>