<template>
  <div class="chat__send" v-if="chatData.title">
    <div
      class="chat__input"
      contenteditable="true"
      data-placeholder="Type message"
      ref="message"
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
    <button @click="sendMessage"><i class="bi bi-send"></i></button>
  </div>
</template>

<script>
import $api from "../../axios";

import { inject, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  setup() {
    const store = useStore();
    const chatId = computed(() => route.params.id);
    const chatData = computed(() => store.state.chat.chats[chatId.value]);
    const editMessageData = ref(null);
    const chatSocket = inject("chatSocket");

    const route = useRoute();
    const message = ref(null);

    const files = inject("files");

    const userData = computed(() => store.state.auth.user);

    const userId = userData.value.id;
    const userLogin = userData.value.login;

    function removeFile(id) {
      files.value.push(
        ...Array.from(files.value).filter((_, index) => index !== id)
      );
    }

    // async function sendMessage() {
    //   console.log(chatId);
    //   let filesUpload = null;
    //   console.log("1", typeof files.value, files, files.value);
    //   // eslint-disable-next-line no-constant-condition
    //   if (files.value.length > 0) {
    //     const formData = new FormData();

    //     formData.append("path", chatId.value);
    //     formData.append("userId", userId);
    //     files.value.forEach((file) => {
    //       formData.append("files", file);
    //     });

    //     const resUpload = await $api.post("file/add", formData);
    //     filesUpload = resUpload.data;
    //   }

    //   chatSocket.emit("sendMessage", {
    //     authorLogin: userLogin,
    //     text: message.value.textContent,
    //     chatId: chatId.value,
    //     files: filesUpload,
    //   });
    //   message.value.textContent = "";
    //   files.value.length = 0;
    // }

    async function sendMessage() {
      debugger;
      let filesUpload = null;
      const inseredFilesData = [];
      console.log("files", files.value);
      if (files.value.length > 0) {
        const formData = new FormData();

        // TODO: Add room path foulder
        formData.append("path", "5d6e4a4e-761d-4e08-93e3-0b96e49ec627");
        formData.append("userId", userId);

        for (const file of files.value) {
          formData.append("files", file);
        }

        const config = {
          onUploadProgress: function (progressEvent) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log("upload file - ", percentCompleted);
            //fileUploadPercent.value = percentCompleted;
          },
        };

        try {
          const resUpload = await $api.post(
            `${import.meta.env.VITE_STORAGE}/file/add`,
            formData,
            config
          );
          inseredFilesData.push(...resUpload.data);
        } catch (e) {
          // TODO: alert error
          console.log("UPLOAD ERROR", e);
          return;
        }
      }

      const messageText = message.value.textContent;

      if (editMessageData.value) {
        // console.log({
        //   roomId: chatId.value,
        //   messageId: editMessageData.value.id,
        //   updatedText: messageText.value,
        //   deletedFiles,
        //   files: inseredFilesData,
        // });
        chatSocket.emit("edit_message", {
          roomId: chatId.value,
          messageId: editMessageData.value.id,
          updatedText: messageText,
          deletedFiles,
          files: inseredFilesData,
        });
        cancelEditMessage();
      } else {
        if (!messageText && inseredFilesData.length === 0) return;

        const messageData = {
          roomId: chatId.value,
          authorId: userId,
          authorLogin: userLogin,
          text: messageText,
          files: inseredFilesData,
        };
        chatSocket.emit("sendMessage", messageData);
      }

      message.value.textContent = "";
    }

    return {
      message,
      chatData,
      sendMessage,
      files,
      removeFile,
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
    background-color: var(--bgcColor);
    color: var(--textColor);

    button {
      grid-column: 2/3;
      grid-row: 1/2;
      height: 40px;
      align-self: end;
      border: none;
      background-color: var(--activeColor);

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
    background-color: var(--bgcColor);
    border-left: 1px solid black;
  }

  &__file {
    margin: 3px 8px;
    a {
      color: var(--linkColor);
      text-decoration: none;
    }
  }
}
</style>
