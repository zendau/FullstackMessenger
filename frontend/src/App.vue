<template>
  <component :is="appLayout">
    <router-view />
  </component>
</template>

<script>
import { useStore } from "vuex";
import { computed, provide, ref } from "vue";
import { useI18n } from "vue-i18n";

import AuthSocketLayoutVue from "./layout/AuthSocketLayout.vue";
import noAuthLayoutVue from "./layout/NoAuthLayout.vue";

import { getUserTheme } from "@/utils/theme";
import { io } from "socket.io-client";

export default {
  setup() {
    getUserTheme();

    const { locale } = useI18n();
    locale.value = localStorage.getItem("locale") ?? locale.value;

    const peerSocket = io(import.meta.env.VITE_SOCKET_PEER_HOST, { path: "/peerChat", autoConnect: false });
    provide("peerSocket", peerSocket);

    const chatSocket = io(import.meta.env.VITE_SOCKET_HOST, { path: "/socketChat", autoConnect: false });
    provide("chatSocket", chatSocket);

    const store = useStore();

    store.dispatch("auth/initAuth");

    const callingData = ref(null);
    provide("callingData", callingData);

    const authStatus = computed(() => store.state.auth.authStatus);

    const appLayout = computed(() => {
      console.log("CHANGE AUTH STATUS", authStatus.value);
      if (authStatus.value) {
        return AuthSocketLayoutVue;
      }

      return noAuthLayoutVue;
    });

    return {
      appLayout,
    };
  },
};
</script>

<style lang="scss">
body {
  background-color: var(--color-background-secondary);
}

* {
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--scrollbarTrack);
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--scrollbarThumb);
    box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
    border-radius: 10px;
  }
}

.empty_message {
  text-align: center;
  color: var(--color-danger);
  margin: 25px;
}

.btn {
  background-color: var(--button-chat-color);
  border: none;
  color: var(--color-primary);
  border-radius: 2px;
  padding: 5px 9px;
  cursor: pointer;
  transition: 0.3s ease;

  i {
    font-size: 22px;
  }

  &:hover {
    background-color: var(--button-chat-hover);
  }
}

.modal {
  width: 400px;
  height: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: var(--color-background);
  color: var(--color-primary);
  border-radius: 10px;
  box-shadow: 2px 2px 41px -6px rgba(34, 60, 80, 0.2);

  &__container-btn {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin: 35px 0;
  }

  &__btn {
    background-color: var(--button-chat-color);
    transition: 0.3s ease;
    cursor: pointer;
    border: none;
    outline: none;
    color: var(--color-primary);
    padding: 6px;
    width: 140px;
    border-radius: 5px;

    &:hover {
      background-color: var(--button-chat-hover);
    }

    &:disabled,
    &[disabled] {
      cursor: not-allowed;
    }
  }

  .close-btn {
    position: absolute;
    right: 32px;
    top: 32px;
    width: 32px;
    height: 32px;
    opacity: 0.3;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    &:before,
    &:after {
      position: absolute;
      left: 15px;
      content: " ";
      height: 33px;
      width: 2px;
      background-color: var(--color-icon);
    }

    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }

  .info {
    width: 100%;
    word-break: break-all;
    max-height: 120px;
    overflow: auto;
  }
}

.user {
  &__container {
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    padding: 50px 0;
  }

  &__title {
    text-align: center;
    /* margin: 25px 0; */
    color: var(--color-primary);
    margin-bottom: 10px;
  }

  &__hr {
    width: 30%;
    margin: 35px auto;
    border-color: var(--color-secondary);
  }

  &__text {
    text-align: center;
  }

  &__link {
    text-align: center;
    display: block;
    color: var(--color-links);
    text-decoration: none;
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    margin-top: 20px;

    label {
      margin-bottom: 6px;
      color: var(--color-primary);
    }

    input {
      border: none;
      outline: none;
      color: var(--color-primary);
      font-size: 18px;
      margin-bottom: 20px;
      padding: 8px 10px;
      margin-bottom: 20px;
      border-radius: 5px;

      &::placeholder {
        color: var(--color-primary);
      }
    }

    input[type="submit"] {
      background-color: var(--button-chat-color);
      transition: 0.3s ease;
      cursor: pointer;
      margin-bottom: 0;
      margin-top: 15px;

      &:disabled {
        cursor: not-allowed;
      }

      &:hover {
        background-color: var(--button-chat-hover);
      }
    }

    select,
    input {
      width: 200px;
      font-size: 16px;
      background-color: var(--input-background);
    }

    select {
      margin: 15px 0;

      border: none;
      outline: none;
      color: var(--color-primary);
      border-radius: 0;
    }
  }
}

.router-link-active {
  color: var(--color-links-active) !important;
}

@media (max-width: 960px) {
  .user {
    &__container {
      height: 100vh;
    }
  }
}

@media (max-width: 720px) {
  .chat__header {
    font-size: 13px;
  }

  .user {
    &__container {
      width: 90%;
      margin: 0 auto;
    }
  }
}

@media (max-height: 420px) {
  .user {
    &__form {
      input {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
