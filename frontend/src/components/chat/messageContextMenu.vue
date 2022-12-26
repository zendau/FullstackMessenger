<template>
  <Modal :isShowCTX="isShowCTX" @closeCTX="closeCTX">
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
  </Modal>
</template>

<script>
import { inject, computed } from "vue";
import Modal from "../UI/Modal.vue";

export default {
  components: { Modal },
  emits: ["deleteMessages"],
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

      selectedMessages.value.push({
        id: props.ctxMenuData.message.id,
        isRead: props.ctxMenuData.isRead,
      });
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
      console.log("test", props.ctxMenuData.message);
      emit("deleteMessages", [
        { id: props.ctxMenuData.message.id, isRead: props.ctxMenuData.isRead },
      ]);
      isShowMessageCTX.value = null;
    }

    function closeCTX() {
      console.log("close", isShowMessageCTX.value);
      isShowMessageCTX.value = null;
    }

    return {
      selectMessageHandler,
      editMessage,
      deleteMessage,
      closeCTX,
      isShowCTX,
    };
  },
};
</script>

<style></style>
