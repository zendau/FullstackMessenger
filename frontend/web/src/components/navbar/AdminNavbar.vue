<template>
  <div class="admin__menu">
    <a
      class="admin__dropdown-toggle"
      href="#"
      role="button"
      @click="isShowSunMenu = !isShowSunMenu"
    >
      {{ $t("navbar.adminNavbar.submenu") }}
    </a>

    <ul
      class="admin__dropdown-menu"
      :class="{ 'admin__dropdown-menu--show': isShowSunMenu }"
      @click="isShowSunMenu = false"
    >
      <li>
        <router-link
          class="admin__dropdown-item"
          to="/admin/users"
        >
          {{ $t("navbar.adminNavbar.users") }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const isShowSunMenu = ref(false);

    return {
      isShowSunMenu,
    };
  },
};
</script>

<style lang="scss" scoped>
.admin {
  &__menu {
    position: relative;
  }

  &__dropdown {
    &-menu {
      display: none;
      position: absolute;
      list-style: none;
      top: 35px;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      background-color: var(--color-background);
      border-top: 1px solid rgba(0, 0, 0, 0.2);
      justify-content: center;
      z-index: 10;

      li {
        width: 100%;
      }

      &--show {
        display: flex;
      }
    }

    &-item {
      width: 100%;
      text-align: center;
      display: block;
      padding: 7px !important;
    }
  }
}

@media (max-width: 960px) {
  .admin {
    &__menu {
      position: relative;
    }

    &__dropdown {
      &-menu {
        position: relative;
        top: 0;
        left: 0;
        transform: initial;
        border-top: none;
      }
    }
  }
}
</style>
