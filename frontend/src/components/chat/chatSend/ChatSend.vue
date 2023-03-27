<template>
  <div
    v-if="isPrivateBanned"
    class="chat__banned"
  >
    {{ $t(isPrivateBanned) }}
  </div>
  <div
    v-else
    class="chat__send"
  >
    <ChatPressing :user-login="userPressing" />
    <ChatEditMessage
      v-if="editMessageData"
      :edit-text-message="editMessageData.text"
      @cancel-message="cancelMessage"
    />
    <div
      ref="message"
      class="chat__input"
      contenteditable="true"
      :data-placeholder="$t('chat.chatSend.placeholder')"
      @keydown.enter.exact="sendMessage"
      @input="inputPress"
    />
    <ChatFiles @delete-file="deleteFileById" />
    <ChatFileUpload :file-upload-percent="fileUploadPercent" />
    <button @click="sendMessage">
      <font-awesome-icon icon="fa-solid fa-paper-plane" />
    </button>
  </div>
</template>

<script>
import { inject, ref, computed, watch } from "vue";
import { useStore } from "vuex";

import $api from "axios";
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
      type: [String, Boolean],
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const chatId = inject("chatId");
    const chatData = inject("chatData");

    const editMessageData = inject("editMessageData");
    const chatSocket = inject("chatSocket");
    const message = ref(null);

    const files = inject("files");
    const fileUploadPercent = ref(null);

    const userData = computed(() => store.state.auth.user);

    const userId = userData.value.id;
    const userLogin = userData.value.login;

    const userPressing = ref(null);

    const deletedFiles = [];

    const isCallSendAfterCreate = inject("isCallSendAfterCreate", false);

    function deleteFileById(fileId, file) {
      files.value = files.value.filter((_, index) => index !== fileId);
      console.log("DELETE FILE", editMessageData.value, file, "fileName" in file);
      if (editMessageData.value && "fileName" in file) {
        console.log("insert delete");
        deletedFiles.push(file.id);
      }
    }

    watch(chatId, () => {
      console.log("change 1");
      if (chatId.value && isCallSendAfterCreate.value) {
        isCallSendAfterCreate.value = false;
        sendMessage();
      }
    });

    async function sendMessage() {
      console.log("change 2");
      if (!chatId.value && store.state.chat.tempPrivateChat) {
        chatSocket.emit("createChat", {
          users: [store.state.chat.tempPrivateChat.id, store.state.auth.user.id],
        });
        console.log("create chat before sending message");
        isCallSendAfterCreate.value = true;
        return;
      }

      console.log("sending message");
      let inseredFilesData = [];
      console.log("files", files.value);
      if (files.value.length > 0) {
        const formData = new FormData();

        formData.append("path", chatId.value);
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
          inseredFilesData = resUpload.data;
        } catch (e) {
          // TODO: alert error
          console.log("UPLOAD ERROR", e);
          store.commit("alert/setErrorMessage", "error.fileUpload");
          return;
        }
      }

      const messageText = message.value.getInnerHTML().trim();
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
        // if (messageText.length === 0) return;

        if (messageText.length === 0 && inseredFilesData.length === 0) {
          return;
        }

        const messageData = {
          roomId: chatId.value,
          authorId: userId,
          authorLogin: userLogin,
          text: messageText,
          files: inseredFilesData,
          users: Object.values(chatData.value.users),
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
        userName: userLogin,
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
  &__banned {
    color: var(--color-primary);
    text-align: center;
    margin-bottom: 10px;
  }

  &__send {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 60px;
    grid-template-rows: auto;
    background-color: var(--color-background);
    color: var(--color-primary);

    button {
      grid-column: 2/3;
      grid-row: 3/4;
      height: 40px;
      align-self: end;
      border: none;
      background-color: var(--color-links-active);
      cursor: pointer;

      svg {
        color: var(--color-primary);
        font-size: 18px;
      }
    }
  }

  &__pressing {
    padding: 10px;
    grid-row: 1/2;
  }

  &__input {
    box-sizing: border-box;
    width: 100%;
    min-height: 1.4em;
    max-height: 10em;
    background-color: var(--color-primary);
    font-size: 16px;
    text-align: left;
    overflow-y: auto;
    grid-column: 1/2;
    grid-row: 3/4;
    background-color: inherit;
    outline: none;
    padding: 10px;
    border-left: 1px solid black;

    &::-webkit-scrollbar {
      width: 0;
    }

    &:empty:before {
      content: attr(data-placeholder);
      color: var(--color-secondary);
    }
    // div {
    //     border: none;
    //     padding: 0;
  }

  &__files {
    box-shadow: 0 -2px 2px rgb(0 0 0 / 25%);
    margin-top: 2px;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 3px;
    grid-column: 1/3;
    grid-row: 5/6;
    background-color: var(--color-background);
  }
}
</style>
