<template>
  <div class="admin__menu">
    <a class="admin__dropdown-toggle" href="#" role="button" @click="isShowSunMenu = !isShowSunMenu">
      Admin menu
    </a>

    <ul class="admin__dropdown-menu" :class="{ 'admin__dropdown-menu--show': isShowSunMenu }"
      @click="isShowSunMenu = false">
      <li>
        <router-link class="admin__dropdown-item" to="/admin/users">Users</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const isShowSunMenu = ref(false)

    return {
      isShowSunMenu
    }
  }
}
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
      background-color: #17212b;
      border-top: 1px solid black;
      justify-content: center;

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
        top: 50%;
        left: 100%;
        transform: translateY(-50%);
        border: 1px solid black;
      }
    }
  }
}
</style>