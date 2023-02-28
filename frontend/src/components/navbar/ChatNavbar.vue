<template>
  <header>
    <nav class="chat__menu">
      <ul class="chat__list">
        <li @click="toogleMobileChats(true)">
          <a
            class="chat__list-item"
            :class="{ 'chat__list-item--active': showChats }"
          >
            <font-awesome-icon
              class="list-item__icon"
              icon="fa-solid fa-comment-dots"
            />
            <span>{{ $t("navbar.chatNavbar.chats") }}</span>
          </a>
        </li>
        <li @click="toogleMobileChats(false)">
          <a
            class="chat__list-item"
            :class="{ 'chat__list-item--active': !showChats }"
          >
            <font-awesome-icon
              class="list-item__icon"
              icon="fa-solid fa-address-book"
            />
            <span>{{ $t("navbar.chatNavbar.contacts") }}</span>
          </a>
        </li>
        <li>
          <router-link
            class="chat__list-item"
            to="/conferences"
          >
            <font-awesome-icon
              class="list-item__icon"
              icon="fa-solid fa-phone"
            />
            <span>{{ $t("navbar.chatNavbar.calls") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            class="chat__list-item"
            to="/settings"
          >
            <font-awesome-icon
              class="list-item__icon"
              icon="fa-solid fa-gear"
            />
            <span>{{ $t("navbar.chatNavbar.settings") }}</span>
          </router-link>
        </li>
      </ul>
      <a
        class="chat__list-item chat__list-item--exit"
        href="#"
        @click="logout"
      >
        <font-awesome-icon
          class="list-item__icon"
          icon="fa-solid fa-right-from-bracket"
        />
        <span>{{ $t("navbar.chatNavbar.exit") }}</span>
      </a>
    </nav>
  </header>
</template>

<script>
import { inject } from "vue";

import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const isShowMobileMessages = inject("isShowMobileMessages");

    const showChats = inject("showChats");

    route.query.page = "chat";

    function toogleMobileChats(chatStatus) {
      showChats.value = chatStatus;
      isShowMobileMessages.value = false;
      router.push("/chat");
    }

    function logout() {
      store.dispatch("auth/logout");
    }

    return {
      toogleMobileChats,
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
    background-color: var(--color-background-secondary);
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
      height: 63px;
      justify-content: space-around;

      i,
      span {
        color: var(--color-primary);
      }

      &--exit span {
        letter-spacing: 1px;
      }

      &--active {
        background-color: var(--color-background-active);

        .list-item__icon,
        span {
          color: var(--color-links-active);
        }
      }

      i {
        font-size: 26px;
      }
    }
  }
}

.list-item {
  &__icon {
    color: var(--color-icon);
    font-size: 26px;
  }
}
</style>
