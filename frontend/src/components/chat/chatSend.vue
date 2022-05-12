<template>
  <div class="chat__send" v-if="roomData.title">
    <div
      class="chat__input"
      contenteditable="true"
      data-placeholder="Type message"
      ref="message"
    ></div>
    <ul class="chat__files" v-if="false">
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test1.txt</a>
      </li>
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test2.txt</a>
      </li>
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test3.txt</a>
      </li>
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test4.txt</a>
      </li>
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test5.txt</a>
      </li>
    </ul>
    <button @click="sendMessage"><i class="bi bi-send"></i></button>
  </div>
</template>

<script>

import $api from '../../axios'

import { inject, ref, computed } from "vue";
import { useStore } from 'vuex'
import {useRoute } from "vue-router"
export default {
  setup() {
    const roomData = inject("roomData");
    const socket = inject('socket')

    const route = useRoute()
    const store = useStore()
    const message = ref(null)
    const files = ref(null)
    const roomId = route.params.id

    const userData = computed(() => store.getters["auth/getUserData"]);

    const userId = userData.value.id
    const userLogin = userData.value.login

    async function sendMessage() {
      console.log(roomId);
      let filesUpload = null;
      if (files.value !== null) {
        const formData = new FormData();

        formData.append("path", roomId);
        formData.append("userId", userId);
        files.value.forEach((file) => {
          formData.append("files", file);
        });
        // TODO: исправить axios на $api при переносе на микросервисы

        const resUpload = await $api.post("file/add", formData);
        filesUpload = resUpload.data;
      }

      socket.emit("sendMessage", {
        authorLogin: userLogin,
        text: message.value.textContent,
        chatId: roomId,
        files: filesUpload,
      });
      message.value.textContent = "";
      files.value = null;
    }

    return {
      message,
      roomData,
      sendMessage
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__send {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 60px;
    background-color: $bgcColor;
    color: $textColor;

    button {
      grid-column: 2/3;
      grid-row: 1/2;
      height: 40px;
      align-self: end;
      border: none;
      background-color: $activeColor;

      i {
        font-size: 28px;
        &::before {
          transform: rotateZ(45deg);
        }
      }
    }
  }

  &__input {
    box-sizing: border-box;
    width: 100%;
    min-height: 1.4em;
    max-height: 10em;
    background-color: white;
    font-size: 16px;
    text-align: left;
    overflow-y: auto;
    grid-column: 1/2;
    background-color: inherit;
    outline: none;
    padding: 10px;
    border-left: 1px solid black;

    &::-webkit-scrollbar {
      width: 0;
    }

    &:empty:before {
      content: attr(data-placeholder);
    }
    // div {
    //     border: none;
    //     padding: 0;
  }

  &__files {
    border-top: 1px solid black;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 3px;
    grid-column: 1/3;
    background-color: $bgcColor;
  }

  &__file {
    margin: 3px 8px;
    a {
      color: $linkColor;
      text-decoration: none;
    }
  }
}
</style>