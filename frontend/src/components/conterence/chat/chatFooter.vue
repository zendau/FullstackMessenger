<template>
  <div class="chat__footer">
    <div class="chat__content">
      <div
        class="chat__input"
        contenteditable="true"
        data-placeholder="Type message"
        ref="message"
        @keypress.enter="sendMessage"
      ></div>
      <ul class="chat__files" v-if="files.length > 0">
        <li
          class="chat__file"
          v-for="(file, index) in files"
          :key="index"
          @click="removeFile(index)"
        >
          <i class="bi bi-file-earmark-arrow-down"></i>{{ file.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import $api from "../../../axios";

export default {
  props: ["roomId"],
  setup(props) {
    const files = inject("files");

    const message = ref(null);
    const socket = inject("socket");
    const store = useStore();

    const userData = computed(() => store.state.auth.user);

    const userLogin = userData.value.login;
    const userId = userData.value.id;

    function removeFile(id) {
      files.value = Array.from(files.value).filter((_, index) => index !== id);
    }

    async function sendMessage(e) {
      if (e.which === 13 && e.shiftKey === false) {
        e.preventDefault();

        let filesUpload = null;
        console.log("1", typeof files.value, files, files.value);

        if (files.value.length > 0) {
          const formData = new FormData();

          formData.append("path", props.roomId);
          formData.append("userId", userId);
          files.value.forEach((file) => {
            formData.append("files", file);
          });

          const resUpload = await $api.post("file/add", formData);
          filesUpload = resUpload.data;
        }

        socket.emit("sendMessage", {
          authorLogin: userLogin,
          text: message.value.textContent,
          chatId: props.roomId,
          files: filesUpload,
        });
        message.value.textContent = "";
      }
    }

    return {
      files,
      message,
      removeFile,
      sendMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__footer {
    height: auto;
    position: relative;
  }

  &__content {
    bottom: 0;
    width: 100%;
  }

  &__input {
    box-sizing: border-box;
    width: 100%;
    min-height: 1.4em;
    max-height: 10em;
    font-size: 16px;
    text-align: left;
    overflow-y: auto;
    border: none;
    outline: none;
    color: $textColor;
    background-color: $itemColor;
    border-bottom: 1px solid black;
    padding: 10px;

    &:empty:before {
      content: attr(data-placeholder);
    }

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

  &__files {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    background-color: $itemColor;
    padding: 5px;
    justify-content: flex-start;
    box-sizing: border-box;
  }

  &__file {
    text-decoration: none;
    color: $linkColor;
    transition: 0.3s ease;
    cursor: pointer;
    margin-right: 15px;

    &:hover {
      color: $textColor;
    }
  }
}
</style>
