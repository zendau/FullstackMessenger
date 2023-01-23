<template>
  <component :is="authLayout">
    <router-view />
  </component>
</template>

<script>
import { useStore } from "vuex";
import { computed, provide } from "vue";

import AuthMainLayout from "./layout/auth.main.layout.vue";
import AuthChatLayout from "./layout/auth.chat.layout.vue";
import noAuthLayoutVue from "./layout/noAuth.layout.vue";

import { Layout } from "./router/layouts";
import { useRoute } from "vue-router";

import { io } from "socket.io-client";

export default {
  components: {},
  setup() {
    // TODO: TEMP
    document.documentElement.dataset.theme = "dark";

    const store = useStore();

    store.dispatch("auth/checkAuth");

    const layouts = new Map();

    layouts.set(Layout.Chat, AuthChatLayout);
    layouts.set(Layout.Main, AuthMainLayout);
    layouts.set(Layout.NoAuth, noAuthLayoutVue);

    const authStatus = computed(() => store.state.auth.authStatus);
    const userId = computed(() => store.state.auth.user.id);

    const route = useRoute();
    const authLayout = computed(() => {
      if (authStatus.value) {
        return layouts.get(route.meta.layout);
      }

      return noAuthLayoutVue;
    });

    const chatSocket = io("http://localhost:80", { path: "/socketChat" });
    provide("chatSocket", chatSocket);

    chatSocket.on("connect", () => {
      chatSocket.emit("connect-user", userId.value);
    });

    return {
      authLayout,
    };
  },
};
</script>

<style lang="scss">
body {
  background-color: var(--menuColor);
}

* {
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
}

.empty_message {
  text-align: center;
  color: var(--textColor);
  margin-top: 15px;
}

.btn {
  background-color: var(--btnChat);
  border: none;
  color: var(--textColor);
  border-radius: 2px;
  padding: 5px 9px;
  cursor: pointer;
  transition: 0.3s ease;

  i {
    font-size: 22px;
  }

  &:hover {
    background-color: var(--btnHover);
  }
}

.user {
  &__container {
    width: 600px;
    background-color: var(--bgcColor);
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    color: var(--textColor);
    border-radius: 3px;
    padding: 30px 0;
    height: fit-content;
  }

  &__title {
    text-align: center;
    margin: 25px 0;
    color: var(--textColor);
  }

  &__hr {
    width: 80%;
    margin: 35px auto;
    border-color: var(--secondTextColor);
  }

  &__text {
    text-align: center;
  }

  &__link {
    align-self: center;
    color: var(--linkColor);
    text-decoration: none;
    margin-bottom: 15px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    margin-top: 20px;

    label {
      margin-bottom: 5px;
      color: var(--textColor);
    }

    input {
      border: none;
      outline: none;
      color: var(--textColor);
      padding: 5px;
      font-size: 18px;
      margin-bottom: 20px;

      &::placeholder {
        color: var(--textColor);
      }
    }

    input[type="submit"] {
      background-color: var(--btnChat);
      transition: 0.3s ease;
      cursor: pointer;

      &:disabled {
        cursor: not-allowed;
      }

      &:hover {
        background-color: var(--btnHover);
      }
    }

    select,
    input {
      width: 200px;
      font-size: 16px;
      background-color: #242f3d;
    }

    select {
      margin: 15px 0;

      border: none;
      outline: none;
      color: var(--textColor);
      border-radius: 0;
    }
  }
}

@media (max-width: 720px) {
  .chat__header {
    font-size: 10px;
  }

  .user {
    &__container {
      width: 90%;
      margin: 15px auto;
      box-sizing: border-box;
    }
  }
}
</style>
