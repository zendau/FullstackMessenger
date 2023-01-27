<template>
  <div
    v-if="isPrivateBanned"
    style="color: white"
  >
    BANNED
  </div>
  <div
    else
    class="chat__send"
  >
    <ChatEditMessage
      v-if="editMessageData"
      :edit-text-message="editMessageData.text"
      @cancel-message="cancelMessage"
    />
    <ChatPressing :user-login="userPressing" />
    <div
      ref="message"
      class="chat__input"
      contenteditable="true"
      data-placeholder="Type message"
      @keydown.enter.exact="sendMessage"
      @input="inputPress"
    />
    <ChatFiles @delete-file="deleteFileById" />
    <ChatFileUpload :file-upload-percent="fileUploadPercent" />
    <button @click="sendMessage">
      <i class="bi bi-send" />
    </button>
  </div>
</template>

<script>
import { inject, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import $api from "@/axios";
import debounce from "@/utils/debounce";
import throttle from "@/utils/throttle";

import ChatEditMessage from "@/components/chat/chatSend/ChatEditMessage.vue";
import ChatPressing from "@/components/chat/chatSend/ChatPressing.vue";
import ChatFiles from "@/components/chat/chatSend/ChatFiles.vue";
import ChatFileUpload from "@/components/chat/chatSend/ChatFileUpload.vue";

export default {
  components: { ChatEditMessage, ChatPressing, ChatFiles, ChatFileUpload },
  props: {
    isPrivateBanned: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    const store = useStore();
    const chatId = computed(() => route.params.id);
    const chatData = inject("chatData");

    const editMessageData = inject("editMessageData");
    const chatSocket = inject("chatSocket");

    const route = useRoute();
    const message = ref(null);

    const files = inject("files");
    const fileUploadPercent = ref(null);

    const userData = computed(() => store.state.auth.user);

    const userId = userData.value.id;
    const userLogin = userData.value.login;

    const userPressing = ref(null);

    const deletedFiles = [];

    const isCallSendAfterCreate = inject("isCallSendAfterCreate");

    function deleteFileById(fileId, file) {
      files.value = files.value.filter((_, index) => index !== fileId);
      console.log("DELETE FILE", editMessageData.value, file, "fileName" in file);
      if (editMessageData.value && "fileName" in file) {
        console.log("insert delete");
        deletedFiles.push(file.id);
      }
    }

    watch(
      () => route.params.id,
      () => {
        if (route.params.id && isCallSendAfterCreate.value) {
          isCallSendAfterCreate.value = false;
          sendMessage();
        }
      }
    );

    async function sendMessage() {
      if (!route.params.id && store.state.chat.tempPrivateChat) {
        chatSocket.emit("createChat", {
          users: [store.state.chat.tempPrivateChat.id, store.state.auth.user.id],
        });
        console.log("create chat before sending message");
        isCallSendAfterCreate.value = true;
        return;
      }

      console.log("sending message");
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
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log("upload file - ", percentCompleted);
            fileUploadPercent.value = percentCompleted;
          },
        };

        try {
          const resUpload = await $api.post(`${import.meta.env.VITE_STORAGE}/file/add`, formData, config);
          inseredFilesData.push(...resUpload.data);
        } catch (e) {
          // TODO: alert error
          console.log("UPLOAD ERROR", e);
          return;
        }
      }

      const messageText = message.value.getInnerHTML();
      if (editMessageData.value) {
        chatSocket.emit("edit_message", {
          roomId: chatId.value,
          messageId: editMessageData.value.id,
          updatedText: messageText,
          deletedFiles,
          files: inseredFilesData,
        });
        cancelMessage();
      } else {
        console.log("messageText", messageText);
        if (messageText.length === 0 && inseredFilesData.length === 0) return;

        const messageData = {
          roomId: chatId.value,
          authorId: userId,
          authorLogin: userLogin,
          text: messageText,
          files: inseredFilesData,
          users: chatData.value.users,
        };
        chatSocket.emit("sendMessage", messageData);
      }
      cancelMessage();
    }

    function cancelMessage() {
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
      chatSocket.emit("message_pressing", {
        userName: "",
        roomId: chatId.value,
      });
      console.log("press_end");
    });

    const inputStartPress = throttle(() => {
      chatSocket.emit("message_pressing", {
        userName: userId,
        roomId: chatId.value,
      });
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
      cancelMessage,
      userPressing,
      fileUploadPercent,
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
