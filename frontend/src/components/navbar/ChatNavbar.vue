<template>
  <header>
    <nav class="chat__menu">
      <ul class="chat__list">
        <li
          @click="
            showChats = true;
            isShowMobileMessages = false;
          "
        >
          <a
            class="chat__list-item"
            :class="{ 'chat__list-item--active': showChats }"
          >
            <i class="bi bi-chat-dots" />
            <span>{{ $t("chat.header.calls") }}</span>
          </a>
        </li>
        <li
          @click="
            showChats = false;
            isShowMobileMessages = false;
          "
        >
          <a
            class="chat__list-item"
            :class="{ 'chat__list-item--active': !showChats }"
          >
            <i class="bi bi-person-lines-fill" />
            <span>{{ $t("chat.header.contacts") }}</span>
          </a>
        </li>
        <li>
          <router-link
            class="chat__list-item"
            to="/conferences"
          >
            <i class="bi bi-telephone" />
            <span>{{ $t("chat.header.calls") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            class="chat__list-item"
            to="/settings"
          >
            <i class="bi bi-gear" />
            <span>{{ $t("chat.header.settings") }}</span>
          </router-link>
        </li>
      </ul>
      <a
        class="chat__list-item chat__list-item--exit"
        href="#"
        @click="logout"
      >
        <i class="bi bi-box-arrow-right" />
        <span>{{ $t("chat.header.exit") }}</span>
      </a>
    </nav>
  </header>
</template>

<script>
import { inject } from "vue";

import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const route = useRoute();
    const store = useStore();

    const isShowMobileMessages = inject("isShowMobileMessages");

    const showChats = inject("showChats");

    route.query.page = "chat";
    console.log("NAVBAR", route);

    function logout() {
      store.dispatch("auth/logout");
    }

    return {
      isShowMobileMessages,
      showChats,
      logout,
    };
  },
};
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
