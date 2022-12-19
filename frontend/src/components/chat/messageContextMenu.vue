<template>
  <ul
    v-if="isShowCTX"
    style="
      position: absolute;
      z-index: 15;
      background-color: orange;
      list-style: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 20px;
    "
    :style="{
      left: ctxPosition.x + 'px',
      top: ctxPosition.y + 'px',
    }"
  >
    <li style="width: 100%; padding: 5px; cursor: pointer">Copy text</li>
    <li
      v-if="isAuthor"
      @click="editMessage"
      style="width: 100%; padding: 5px; cursor: pointer"
    >
      Edit
    </li>
    <li
      @click="selectMessageHandler"
      style="width: 100%; padding: 5px; cursor: pointer"
    >
      Select
    </li>
    <li
      @click="deleteMessage"
      style="width: 100%; padding: 5px; cursor: pointer"
    >
      Delete
    </li>
  </ul>
</template>

<script>
import { inject } from "vue";

export default {
  props: ["isShowCTX", "ctxPosition", "isAuthor", "messageId"],
  setup(props, { emit }) {
    const isSelectMessagesMode = inject("isSelectMessagesMode");
    const selectedMessages = inject("selectedMessages");
    const editMessageData = inject("editMessageData");
    const isShowMessageCTX = inject("isShowMessageCTX");

    function selectMessageHandler() {
      console.log("test click");
      isSelectMessagesMode.value = !isSelectMessagesMode.value;
      selectedMessages.value.push(props.messageId);
      isShowMessageCTX.value = null;
    }

    function editMessage() {
      console.log("edit messaget id -", props.message.id);
      editMessageData.value = props.message;
    }

    function deleteMessage() {
      ctx.emit("deleteMessages", [props.messageData.id], props.isRead);
    }

    return {
      selectMessageHandler,
      editMessage,
      deleteMessage,
    };
  },
};
</script>

<style></style>
