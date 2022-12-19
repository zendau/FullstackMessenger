<template>
  <Teleport to="#app" v-if="isShowCTX">
    <div
      @contextmenu.prevent="closeMessageCTX"
      @click="closeMessageCTX"
      style="
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        height: 100vh;
        width: 100%;
      "
    ></div>
    <ul
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
        left: ctxMenuData.position.x + 'px',
        top: ctxMenuData.position.y + 'px',
      }"
    >
      <li style="width: 100%; padding: 5px; cursor: pointer">Copy text</li>
      <li
        v-if="ctxMenuData.isAuthor"
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
  </Teleport>
</template>

<script>
import { inject, computed } from "vue";

export default {
  props: ["ctxMenuData"],
  setup(props, { emit }) {
    const isSelectMessagesMode = inject("isSelectMessagesMode");
    const selectedMessages = inject("selectedMessages");
    const editMessageData = inject("editMessageData");
    const isShowMessageCTX = inject("isShowMessageCTX");

    const isShowCTX = computed(
      () => isShowMessageCTX.value === props.ctxMenuData?.message?.id
    );

    const files = inject("files");
    function selectMessageHandler() {
      console.log("test click");
      isSelectMessagesMode.value = !isSelectMessagesMode.value;
      selectedMessages.value.push(props.ctxMenuData.message.id);
      isShowMessageCTX.value = null;
    }

    function editMessage() {
      editMessageData.value = props.ctxMenuData.message;
      console.log(
        "edit messaget id -",
        props.ctxMenuData.message.id,
        editMessageData.value,
        props.ctxMenuData.message
      );
      isShowMessageCTX.value = null;
      files.value = [...props.ctxMenuData.message.files];
    }
    function deleteMessage() {
      ctx.emit("deleteMessages", [props.messageData.id], props.isRead);
    }

    function closeMessageCTX() {
      console.log("close", isShowMessageCTX.value);
      isShowMessageCTX.value = null;
    }

    return {
      selectMessageHandler,
      editMessage,
      deleteMessage,
      closeMessageCTX,
      isShowCTX,
    };
  },
};
</script>

<style></style>
