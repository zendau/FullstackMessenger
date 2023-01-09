<template>
  <div class="chat__send" v-if="chatData.title">
    <div v-if="editMessageData">
      <p>{{ editMessageData.text }}</p>
      <button @click="cancelEditMessage">Cancel</button>
    </div>
    <p v-if="userPressing">{{ userPressing }} is pressing ...</p>
    <div
      class="chat__input"
      contenteditable="true"
      data-placeholder="Type message"
      ref="message"
      @input="inputPress"
    ></div>
    <ul class="chat__files" v-if="files.length > 0">
      <li
        class="chat__file"
        v-for="(file, index) in files"
        :key="index"
        @click="deleteFileById(index, file)"
      >
        <i class="bi bi-file-earmark-arrow-down"></i
        >{{ file?.name ?? file?.fileName }}
      </li>
    </ul>
    <button @click="sendMessage"><i class="bi bi-send"></i></button>
  </div>
</template>

<script>
import $api from "../../axios";

import { inject, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import debounce from "../../utils/debounce";
import throttle from "../../utils/throttle";

export default {
  setup() {
    const store = useStore();
    const chatId = computed(() => route.params.id);
    const chatData = inject("chatData");
    // const chatData = computed(() => store.state.chat.chats[chatId.value]);
    const editMessageData = inject("editMessageData");
    const chatSocket = inject("chatSocket");

    const route = useRoute();
    const router = useRouter();
    const message = ref(null);

    const files = inject("files");
    const fileUploadPercent = ref(null);

    const userData = computed(() => store.state.auth.user);

    const userId = userData.value.id;
    const userLogin = userData.value.login;

    const userPressing = ref(null);

    const deletedFiles = [];

    let isCallSendAfterCreate = false;

    function deleteFileById(fileId, file) {
      files.value = files.value.filter((_, index) => index !== fileId);
      console.log(
        "DELETE FILE",
        editMessageData.value,
        file,
        "fileName" in file
      );
      if (editMessageData.value && "fileName" in file) {
        console.log("insert delete");
        deletedFiles.push(file.id);
      }
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

    watch(
      () => route.params.id,
      () => {
        if (route.params.id && isCallSendAfterCreate) {
          isCallSendAfterCreate = false;
          sendMessage();
        }
      }
    );

    async function sendMessage() {
      debugger;

      if (!route.params.id && store.state.chat.tempPrivateChat) {
        // store.dispatch("chat/createChat", {

        // });

        chatSocket.emit("createChat", {
          users: [
            store.state.chat.tempPrivateChat.id,
            store.state.auth.user.id,
          ],
        });
        console.log("create chat before sending message");
        isCallSendAfterCreate = true;
        return;
      }

      console.log('sending message')

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
        //   updatedText: messageText,
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

    function cancelEditMessage() {
      editMessageData.value = null;
      message.value.textContent = null;
      deletedFiles.length = 0;
      files.value = [];
      fileUploadPercent.value = null;
    }

    function inputPress() {
      inputStartPress();
      inputEndPress();
    }

    const inputEndPress = debounce(() => {
      // chatSocket.emit("message_pressing", {
      //   userName: "",
      //   roomId: chatId.value,
      // });
      console.log("press_end");
    });

    const inputStartPress = throttle(() => {
      // chatSocket.emit("message_pressing", {
      //   userName: userId.value,
      //   roomId: chatId.value,
      // });
      console.log("press_start");
    }, 5000);

    chatSocket.on("message_status", (status) => {
      console.log("status", status);

      if (status.roomId !== chatId.value) return;
      userPressing.value = status.userName;
    });

    return {
      inputPress,
      message,
      chatData,
      sendMessage,
      files,
      deleteFileById,
      editMessageData,
      cancelEditMessage,
      userPressing,
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
